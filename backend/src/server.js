const app = require('./app');
const db = require('./config/db');

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    // Test DB connection
    const connection = await db.getConnection();
    console.log('Database connected successfully');
    
    // Seed demo user
    await connection.query("INSERT INTO users (id, name, email) VALUES (1, 'Demo User', 'demo@example.com') ON DUPLICATE KEY UPDATE name=name");
    console.log('Demo user ensured (ID: 1)');
    
    connection.release();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();
