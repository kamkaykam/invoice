const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Contact = sequelize.define('Contact', {
  type: { type: DataTypes.STRING, allowNull: false }, // 'Delivery', 'Biller', or 'Recipient'
  salutation: { type: DataTypes.STRING, allowNull: true },
  name: { type: DataTypes.STRING, allowNull: false }
});

module.exports = Contact;
