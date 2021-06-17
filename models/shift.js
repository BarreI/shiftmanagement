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
    date: {
      type: Sequelize.DATE,
      allownull: false
    },
    time: {
      type: Sequelize.TEXT,
      allownull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
)

module.exports = Shifts;