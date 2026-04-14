const mysql = require('mysql2/promise');

async function check() {
  const url = 'mysql://root:nqVTchHmDIHYgDNKCuCOsHoMMbBmUZBM@monorail.proxy.rlwy.net:33666/railway';
  try {
    const connection = await mysql.createConnection(url);
    console.log('--- DATABASE VERIFICATION ---');
    console.log('Status: Connected to Railway Central');
    
    const [tables] = await connection.query('SHOW TABLES FROM railway');
    console.log('\nTables Found:');
    tables.forEach(row => console.log(`- ${Object.values(row)[0]}`));
    
    const [users] = await connection.query('SELECT name FROM railway.users');
    console.log(`\nDemo Data: Found user "${users[0].name}"`);
    console.log('\nResult: DATABASE IS FULLY OPERATIONAL ✅');
    
    await connection.end();
  } catch (err) {
    console.error('Check failed:', err.message);
  }
}

check();
