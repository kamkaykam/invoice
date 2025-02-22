const sequelize = require('./config/db');

async function createDatabase() {
  try {
    // Force sync (drops existing tables and recreates them)
    await sequelize.sync({ force: true });
    console.log('Database has been created and all tables are synced.');
    process.exit(0);
  } catch (error) {
    console.error('Error creating database:', error);
    process.exit(1);
  }
}

createDatabase();
