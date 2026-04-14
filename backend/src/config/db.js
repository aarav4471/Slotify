const mysql = require('mysql2/promise');
require('dotenv').config();

let pool;

try {
  const envKeys = Object.keys(process.env).filter(k => k.includes('MYSQL') || k.includes('DATABASE') || k.includes('DB_'));
  console.log('Detected DB-related environment variables:', envKeys.join(', '));

  const connectionUri = process.env.MYSQL_URL || process.env.DATABASE_URL;

  if (connectionUri) {
    console.log(`Initializing pool with connection URI (${connectionUri.startsWith('mysql') ? 'mysql://' : 'unknown type'})...`);
    pool = mysql.createPool(connectionUri);
  } else {
    console.log('Initializing pool with individual environment variables...');
    const config = {
      host: process.env.MYSQLHOST || process.env.DB_HOST || 'localhost',
      user: process.env.MYSQLUSER || process.env.DB_USER || 'root',
      password: process.env.MYSQLPASSWORD || process.env.DB_PASSWORD || '',
      database: process.env.MYSQLDATABASE || process.env.DB_NAME || 'railway',
      port: parseInt(process.env.MYSQLPORT || process.env.DB_PORT || '3306'),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      enableKeepAlive: true,
      keepAliveInitialDelay: 0
    };
    console.log(`Connecting to ${config.user}@${config.host}:${config.port}/${config.database}`);
    pool = mysql.createPool(config);
  }
} catch (err) {
  console.error('CRITICAL: Failed to initialize MySQL pool structure:');
  console.error(err);
  throw err;
}

module.exports = pool;
