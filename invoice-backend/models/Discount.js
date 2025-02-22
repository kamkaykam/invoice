const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const PaymentConditions = require('./PaymentConditions');

const Discount = sequelize.define('Discount', {
  paymentDate: { type: DataTypes.DATE, allowNull: false },
  percentage: { type: DataTypes.DECIMAL(5, 2), allowNull: false }
});

Discount.belongsTo(PaymentConditions, { foreignKey: 'paymentConditionsId', onDelete: 'CASCADE' });
PaymentConditions.hasMany(Discount, { foreignKey: 'paymentConditionsId' });

module.exports = Discount;
