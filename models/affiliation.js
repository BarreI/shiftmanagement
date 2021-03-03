'use strict'
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Affiliatons = loader.database.define(
  'affiliations',
  {
    affiliatonid: {
      type: Sequelize.UUID,
      allownull: false
    },
    systemid: {
      type: Sequelize.UUID,
      allownull: false
    },
    storeid: {
      type: Sequelize.UUID,
      allownull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Affiliatons;