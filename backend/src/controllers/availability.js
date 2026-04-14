const db = require('../config/db');
const { parseISO, format, addMinutes, isBefore, isAfter, startOfDay, endOfDay } = require('date-fns');

exports.saveAvailability = async (req, res, next) => {
  try {
    const { schedule } = req.body; // Array: [{ day_of_week: 1, start_time: "09:00", end_time: "17:00" }, ...]
    const user_id = 1;

    // In a real app we might use a transaction here
    await db.query('DELETE FROM availability WHERE user_id = ?', [user_id]);

    if (schedule && schedule.length > 0) {
      const values = schedule.map(slot => [user_id, slot.day_of_week, slot.start_time, slot.end_time]);
      await db.query('INSERT INTO availability (user_id, day_of_week, start_time, end_time) VALUES ?', [values]);
    }

    res.json({ message: 'Availability updated' });
  } catch (err) {
    next(err);
  }
};

exports.getAvailability = async (req, res, next) => {
  try {
    const user_id = 1;
    const [availability] = await db.query('SELECT day_of_week, start_time, end_time FROM availability WHERE user_id = ?', [user_id]);
    res.json(availability);
  } catch (err) {
    next(err);
  }
};

exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { eventSlug } = req.params;
    const dateQuery = req.query.date; // YYYY-MM-DD
    
    if (!dateQuery) return res.status(400).json({ error: 'Date is required' });

    // Find the event type
    const [eventTypes] = await db.query('SELECT * FROM event_types WHERE slug = ?', [eventSlug]);
    if (eventTypes.length === 0) return res.status(404).json({ error: 'Event type not found' });
    const event = eventTypes[0];

    // Get the day of the week for the specified date (Sunday = 0, Monday = 1...)
    const requestedDate = new Date(dateQuery);
    const dayOfWeek = requestedDate.getUTCDay();
    
    console.log(`Checking slots for ${eventSlug} on ${dateQuery} (Day: ${dayOfWeek})`);

    // Fetch availability for that day
    const [avails] = await db.query('SELECT * FROM availability WHERE user_id = ? AND day_of_week = ?', [event.user_id, dayOfWeek]);
    console.log(`Found ${avails.length} availability records for user ${event.user_id} on day ${dayOfWeek}`);

    if (avails.length === 0) return res.json({ slots: [] }); // No slots that day

    const avail = avails[0];

    // Find conflicting bookings
    const startOfRequestedDay = `${dateQuery} 00:00:00`;
    const endOfRequestedDay = `${dateQuery} 23:59:59`;
    
    // Selecting all bookings on that day for ANY event type from this user (to avoid overlapping meetings for the user)
    const [bookings] = await db.query(`
      SELECT b.start_time, b.end_time, e.buffer_time_minutes 
      FROM bookings b
      JOIN event_types e ON b.event_type_id = e.id
      WHERE e.user_id = ? AND b.start_time >= ? AND b.start_time <= ? AND b.status = 'CONFIRMED'
    `, [event.user_id, startOfRequestedDay, endOfRequestedDay]);

    // Generate possible slots
    const slots = [];
    const totalDuration = event.duration_minutes + event.buffer_time_minutes;

    const [startHour, startMin] = avail.start_time.split(':').map(Number);
    const [endHour, endMin] = avail.end_time.split(':').map(Number);

    let currentTime = new Date(requestedDate);
    currentTime.setUTCHours(startHour, startMin, 0, 0);

    const endTime = new Date(requestedDate);
    endTime.setUTCHours(endHour, endMin, 0, 0);

    // Calculate slots
    while (true) {
      let slotEndTime = addMinutes(currentTime, event.duration_minutes);
      
      if (isAfter(slotEndTime, endTime)) break;

      // Check if slot overlaps with any existing booking
      let isAvailable = true;
      for (const booking of bookings) {
        const bookStart = new Date(booking.start_time);
        
        // Add buffer time to the booking's end time
        const bookEnd = addMinutes(new Date(booking.end_time), booking.buffer_time_minutes);

        // overlap condition: SlotStart < BookEnd AND SlotEnd > BookStart
        if (currentTime < bookEnd && slotEndTime > bookStart) {
          isAvailable = false;
          break;
        }
      }

      if (isAvailable) {
        slots.push(format(currentTime, "HH:mm"));
      }

      // Increment by a fixed interval or by the duration. Let's do fixed 30 mins or duration.
      // Easiest is to step by event duration + buffer or fixed 15 min steps.
      // Standard calendly steps by standard intervals (e.g., 30 mins)
      currentTime = addMinutes(currentTime, 30); 
    }

    res.json({ slots });
  } catch (err) {
    next(err);
  }
};
