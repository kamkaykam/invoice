const express = require('express');
const app = express();
const port = 3000;
const invoiceRoutes = require('./routes/invoiceRoutes');
const sequelize = require('./config/db');
const cors = require('cors');

app.use(cors());


// Middleware to parse JSON and URL-encoded data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Mount invoice routes under /api/invoices
app.use('/api/invoices', invoiceRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Synchronize the database and start the server
sequelize.sync({ alter: true }).then(() => {
  console.log('Database synchronized');
  app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
  });
}).catch(err => {
  console.error('Failed to synchronize database:', err);
});
