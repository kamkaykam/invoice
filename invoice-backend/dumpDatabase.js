// dumpDatabase.js
const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./database.sqlite');

db.serialize(() => {
  console.log('Database Schema:');
  db.each("SELECT sql FROM sqlite_master WHERE type='table'", (err, row) => {
    if (err) console.error(err);
    console.log(row.sql);
  });

  console.log('\nInvoices Data:');
  db.each("SELECT * FROM Invoices", (err, row) => {
    if (err) console.error(err);
    console.log(row);
  });
});

db.close();
