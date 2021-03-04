'use strict'
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Affiliations = loader.database.define(
  'affiliations',
  {
    affiliationid: {
      type: Sequelize.UUID,
      primaryKey: true,
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

module.exports = Affiliations;