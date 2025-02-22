const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Invoice = require('./Invoice');

const InvoiceRecipient = sequelize.define('InvoiceRecipient', {
  vatIdentificationNumber: { type: DataTypes.STRING, allowNull: false }
});

InvoiceRecipient.belongsTo(Invoice, { foreignKey: 'invoiceId', onDelete: 'CASCADE' });
Invoice.hasOne(InvoiceRecipient, { foreignKey: 'invoiceId' });

module.exports = InvoiceRecipient;
