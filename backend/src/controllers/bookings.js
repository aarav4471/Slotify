const db = require('../config/db');
const { addMinutes } = require('date-fns');

exports.createBooking = async (req, res, next) => {
  try {
    const { eventSlug, guest_name, guest_email, date, time } = req.body; // time is HH:mm
    
    // Find event type
    const [eventTypes] = await db.query('SELECT * FROM event_types WHERE slug = ?', [eventSlug]);
    if (eventTypes.length === 0) return res.status(404).json({ error: 'Event type not found' });
    const event = eventTypes[0];

    const start_time = new Date(`${date}T${time}:00Z`); // Create a proper UTC time
    
    // Double check availability logic here if we want to be extra safe
    // But the database unique constraint handles exact double bookings for the same event and start time.
    // However, we added a constraint `unique_booking_time (event_type_id, start_time)` in schema.sql.
    
    const end_time = addMinutes(start_time, event.duration_minutes);

    const formattedStart = start_time.toISOString().slice(0, 19).replace('T', ' ');
    const formattedEnd = end_time.toISOString().slice(0, 19).replace('T', ' ');

    try {
      const [result] = await db.query(
        'INSERT INTO bookings (event_type_id, guest_name, guest_email, start_time, end_time) VALUES (?, ?, ?, ?, ?)',
        [event.id, guest_name, guest_email, formattedStart, formattedEnd]
      );
      res.status(201).json({ id: result.insertId, message: 'Booking confirmed!' });
    } catch (dbErr) {
      if (dbErr.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ error: 'This time slot was just taken. Please choose another.' });
      }
      throw dbErr;
    }

  } catch (err) {
    next(err);
  }
};

exports.getBookings = async (req, res, next) => {
  try {
    const user_id = 1;
    // Fetch bookings for the user's event types
    const [bookings] = await db.query(`
      SELECT b.id, b.guest_name, b.guest_email, b.start_time, b.end_time, b.status, e.title as event_title
      FROM bookings b
      JOIN event_types e ON b.event_type_id = e.id
      WHERE e.user_id = ?
      ORDER BY b.start_time DESC
    `, [user_id]);
    
    res.json(bookings);
  } catch (err) {
    next(err);
  }
};

exports.cancelBooking = async (req, res, next) => {
    try {
        const { id } = req.params;
        const [result] = await db.query("UPDATE bookings SET status = 'CANCELLED' WHERE id = ?", [id]);
        
        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Booking not found' });
        }
        res.json({ message: 'Booking cancelled' });
    } catch (err) {
        next(err);
    }
};
