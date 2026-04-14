const pool = require('./config/db');

async function check() {
  try {
    const [users] = await pool.query('SELECT * FROM users');
    console.log('--- USERS ---');
    console.table(users);

    const [eventTypes] = await pool.query('SELECT * FROM event_types');
    console.log('--- EVENT TYPES ---');
    console.table(eventTypes);

    const [availability] = await pool.query('SELECT * FROM availability');
    console.log('--- AVAILABILITY ---');
    console.table(availability);

    const [bookings] = await pool.query('SELECT * FROM bookings');
    console.log('--- BOOKINGS ---');
    console.table(bookings);

  } catch (err) {
    console.error('Error querying DB:', err.message);
  } finally {
    process.exit();
  }
}

check();
