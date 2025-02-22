const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Invoice = require('./Invoice');

const PaymentMethod = sequelize.define('PaymentMethod', {
  methodType: { type: DataTypes.STRING, allowNull: false },
  comment: { type: DataTypes.TEXT, allowNull: true }
});

PaymentMethod.belongsTo(Invoice, { foreignKey: 'invoiceId', onDelete: 'CASCADE' });
Invoice.hasOne(PaymentMethod, { foreignKey: 'invoiceId' });

module.exports = PaymentMethod;
