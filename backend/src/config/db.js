const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

try {
  if (process.env.MYSQL_URL) {
    console.log('Initializing pool with MYSQL_URL...');
    pool = mysql.createPool(process.env.MYSQL_URL);
  } else {
    console.log('Initializing pool with individual environment variables...');
    pool = mysql.createPool({
      host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
      user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
      database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
      port: process.env.MYSQLPORT || 3306,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    });
  }
} catch (err) {
  console.error('CRITICAL: Failed to initialize MySQL pool structure:', err.message);
  throw err;
}

module.exports = pool;
