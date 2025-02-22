const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const ListLineItem = require('./ListLineItem');

const LineItemOrderReference = sequelize.define('LineItemOrderReference', {
  orderId: { type: DataTypes.STRING, allowNull: false },
  orderPositionNumber: { type: DataTypes.INTEGER, allowNull: false }
});

LineItemOrderReference.belongsTo(ListLineItem, { foreignKey: 'lineItemId', onDelete: 'CASCADE' });
ListLineItem.hasOne(LineItemOrderReference, { foreignKey: 'lineItemId' });

module.exports = LineItemOrderReference;
