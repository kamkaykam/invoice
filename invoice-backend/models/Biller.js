const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Invoice = require('./Invoice');

const Biller = sequelize.define('Biller', {
  vatIdentificationNumber: { type: DataTypes.STRING, allowNull: false },
  invoiceRecipientsBillerID: { type: DataTypes.STRING, allowNull: false }
});

Biller.belongsTo(Invoice, { foreignKey: 'invoiceId', onDelete: 'CASCADE' });
Invoice.hasOne(Biller, { foreignKey: 'invoiceId' });

module.exports = Biller;
