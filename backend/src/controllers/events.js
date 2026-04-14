const db = require('../config/db');

exports.createEvent = async (req, res, next) => {
  try {
    const { title, slug, duration_minutes, buffer_time_minutes } = req.body;
    // Hardcoded user_id for simplicity (normally from auth token)
    const user_id = 1;

    const [result] = await db.query(
      'INSERT INTO event_types (user_id, title, slug, duration_minutes, buffer_time_minutes) VALUES (?, ?, ?, ?, ?)',
      [user_id, title, slug, duration_minutes, buffer_time_minutes]
    );

    res.status(201).json({ id: result.insertId, title, slug, duration_minutes });
  } catch (err) {
    if (err.code === 'ER_DUP_ENTRY') {
      return res.status(400).json({ error: 'Slug already exists. Please choose another.' });
    }
    next(err);
  }
};

exports.getEvents = async (req, res, next) => {
  try {
    const user_id = 1;
    const [events] = await db.query('SELECT * FROM event_types WHERE user_id = ?', [user_id]);
    res.json(events);
  } catch (err) {
    next(err);
  }
};

exports.getEventBySlug = async (req, res, next) => {
  try {
    const { slug } = req.params;
    const [events] = await db.query('SELECT * FROM event_types WHERE slug = ?', [slug]);
    if (events.length === 0) {
      return res.status(404).json({ error: 'Event type not found' });
    }
    res.json(events[0]);
  } catch (err) {
    next(err);
  }
};
