const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ListLineItem = require('./ListLineItem');

const LineItemTaxItem = sequelize.define('LineItemTaxItem', {
  taxableAmount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
  taxPercent: { type: DataTypes.DECIMAL(5, 2), allowNull: false },
  taxCategoryCode: { type: DataTypes.STRING, allowNull: false }
});

LineItemTaxItem.belongsTo(ListLineItem, { foreignKey: 'lineItemId', onDelete: 'CASCADE' });
ListLineItem.hasOne(LineItemTaxItem, { foreignKey: 'lineItemId' });

module.exports = LineItemTaxItem;
