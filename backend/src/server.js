const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  let connection;
  let retries = 5;
  
  while (retries > 0) {
    try {
      console.log(`Connecting to database... (${retries} attempts left)`);
      connection = await db.getConnection();
      console.log('Database connected successfully');
      
      // Ensure demo user exists
      await connection.query("INSERT INTO users (id, name, email) VALUES (1, 'Demo User', 'demo@example.com') ON DUPLICATE KEY UPDATE name=name");
      console.log('Demo user ensured (ID: 1)');
      
      connection.release();
      break; // Success!
    } catch (error) {
      console.error('Database connection failed:');
      console.error(error);
      retries -= 1;
      if (retries === 0) {
        console.error('Final attempt failed. Exiting.');
        process.exit(1);
      }
      await new Promise(res => setTimeout(res, 3000)); // Wait 3 seconds
    }
  }

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
}

startServer();
