const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Invoice = require('./Invoice');

const ItemList = sequelize.define('ItemList', {
  headerDescription: { type: DataTypes.TEXT, allowNull: true },
  footerDescription: { type: DataTypes.TEXT, allowNull: true }
});

ItemList.belongsTo(Invoice, { foreignKey: 'invoiceId', onDelete: 'CASCADE' });
Invoice.hasMany(ItemList, { foreignKey: 'invoiceId' });

module.exports = ItemList;
