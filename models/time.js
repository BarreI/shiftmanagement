'use strict'
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Times = loader.database.define(
  'times',
  {
    timeid: {
      type: Sequelize.UUID,
      primaryKey: true,
      allownull: false
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

//tf文字列での5分１文字で扱う保存方法をしよう

module.exports = Times;