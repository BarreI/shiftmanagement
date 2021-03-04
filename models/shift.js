'use strict'
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Shifts = loader.database.define(
  'shifts',
  {
    shiftid: {
      type: Sequelize.UUID,
      primaryKey: true,
      allownull: false
    },
    affiliationid: {
      type: Sequelize.UUID, 
      allownull: false
    },
    confirm: {
      type: Sequelize.INTEGER,
      allownull: false
    },
    sdate: {
      type: Sequelize.DATE,
      allownull: false
    },
    edate: {
      type: Sequelize.DATE,
      allownull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
)

module.exports = Shifts;