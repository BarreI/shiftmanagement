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
      type: Sequelize.STRING,
      allownull: false
    },
    joined:{
      type: Sequelize.BOOLEAN,
      allownull:false
    },
    monday: {
      type: Sequelize.TEXT,
      allownull: false
    },
    tuesday: {
      type: Sequelize.TEXT,
      allownull: false
    },
    wednesday: {
      type: Sequelize.TEXT,
      allownull: false
    },
    thursday: {
      type: Sequelize.TEXT,
      allownull: false
    },
    friday: {
      type: Sequelize.TEXT,
      allownull: false
    },
    saturday: {
      type: Sequelize.TEXT,
      allownull: false
    },
    sunday: {
      type: Sequelize.TEXT,
      allownull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Affiliations;