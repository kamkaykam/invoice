const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const UniversalBankTransaction = require('./UniversalBankTransaction');

const BeneficiaryAccount = sequelize.define('BeneficiaryAccount', {
  bic: { type: DataTypes.STRING, allowNull: false },
  iban: { type: DataTypes.STRING, allowNull: false },
  bankAccountOwner: { type: DataTypes.STRING, allowNull: false }
});

BeneficiaryAccount.belongsTo(UniversalBankTransaction, { foreignKey: 'ubtId', onDelete: 'CASCADE' });
UniversalBankTransaction.hasOne(BeneficiaryAccount, { foreignKey: 'ubtId' });

module.exports = BeneficiaryAccount;
