const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Invoice = require('./Invoice');

const PaymentConditions = sequelize.define('PaymentConditions', {
  dueDate: { type: DataTypes.DATE, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: true }
});

PaymentConditions.belongsTo(Invoice, { foreignKey: 'invoiceId', onDelete: 'CASCADE' });
Invoice.hasOne(PaymentConditions, { foreignKey: 'invoiceId' });

module.exports = PaymentConditions;
