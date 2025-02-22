// models/Invoice.js
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Invoice = sequelize.define('Invoice', {
  invoiceNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
  generatingSystem: { type: DataTypes.STRING, allowNull: false },
  documentType: { type: DataTypes.STRING, allowNull: false },
  invoiceCurrency: { type: DataTypes.STRING, allowNull: false },
  language: { type: DataTypes.STRING, allowNull: false },
  invoiceDate: { type: DataTypes.DATE, allowNull: false },
  totalGrossAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  payableAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: true },
  globalComment: { type: DataTypes.TEXT, allowNull: true },
  version: { type: DataTypes.STRING, allowNull: true } // New field for version info
});

module.exports = Invoice;
