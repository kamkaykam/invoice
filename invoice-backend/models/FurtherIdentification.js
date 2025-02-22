const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Biller = require('./Biller');

const FurtherIdentification = sequelize.define('FurtherIdentification', {
  identificationType: { type: DataTypes.STRING, allowNull: false },
  identificationValue: { type: DataTypes.STRING, allowNull: false }
});

FurtherIdentification.belongsTo(Biller, { foreignKey: 'billerId', onDelete: 'CASCADE' });
Biller.hasMany(FurtherIdentification, { foreignKey: 'billerId' });

module.exports = FurtherIdentification;
