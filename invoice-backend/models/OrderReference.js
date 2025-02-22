const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const InvoiceRecipient = require('./InvoiceRecipient');

const OrderReference = sequelize.define('OrderReference', {
  orderId: { type: DataTypes.STRING, allowNull: false },
  referenceDate: { type: DataTypes.DATE, allowNull: false },
  description: { type: DataTypes.TEXT, allowNull: true }
});

OrderReference.belongsTo(InvoiceRecipient, { foreignKey: 'recipientId', onDelete: 'CASCADE' });
InvoiceRecipient.hasOne(OrderReference, { foreignKey: 'recipientId' });

module.exports = OrderReference;
