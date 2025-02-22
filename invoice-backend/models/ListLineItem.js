const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ItemList = require('./ItemList');

const ListLineItem = sequelize.define('ListLineItem', {
  description: { type: DataTypes.TEXT, allowNull: false },
  quantity: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  unit: { type: DataTypes.STRING, allowNull: false },
  unitPrice: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  baseQuantity: { type: DataTypes.DECIMAL(10, 2), allowNull: true, defaultValue: 1 },
  lineItemAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false }
});

ListLineItem.belongsTo(ItemList, { foreignKey: 'itemListId', onDelete: 'CASCADE' });
ItemList.hasMany(ListLineItem, { foreignKey: 'itemListId' });

module.exports = ListLineItem;
