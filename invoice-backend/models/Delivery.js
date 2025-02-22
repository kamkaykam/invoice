const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Invoice = require('./Invoice');

const Delivery = sequelize.define('Delivery', {
  deliveryDate: { type: DataTypes.DATE, allowNull: false }
});

Delivery.belongsTo(Invoice, { foreignKey: 'invoiceId', onDelete: 'CASCADE' });
Invoice.hasOne(Delivery, { foreignKey: 'invoiceId' });

module.exports = Delivery;
