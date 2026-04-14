const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

async function migrate() {
  const url = process.env.MYSQL_URL;
  if (!url) {
    console.error('Error: MYSQL_URL environment variable is not set.');
    process.exit(1);
  }
  console.log('Connecting to MySQL...');
  
  try {
    const connection = await mysql.createConnection(url);
    console.log('Connected!');
    
    const schemaPath = path.join(__dirname, '../../schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // Split by semicolon but ignore inside strings
    const queries = schema
      .split(/;(?=(?:[^']*'[^']*')*[^']*$)/)
      .map(q => q.trim())
      .filter(q => q.length > 0);
      
    for (const query of queries) {
      console.log(`Executing: ${query.substring(0, 50)}...`);
      await connection.query(query);
    }
    
    console.log('Migration completed successfully!');
    await connection.end();
  } catch (err) {
    console.error('Migration failed:', err.message);
    process.exit(1);
  }
}

migrate();
