const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const PaymentMethod = require('./PaymentMethod');

const UniversalBankTransaction = sequelize.define('UniversalBankTransaction', {
  consolidatorPayable: { type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false }
});

UniversalBankTransaction.belongsTo(PaymentMethod, { foreignKey: 'paymentMethodId', onDelete: 'CASCADE' });
PaymentMethod.hasOne(UniversalBankTransaction, { foreignKey: 'paymentMethodId' });

module.exports = UniversalBankTransaction;
