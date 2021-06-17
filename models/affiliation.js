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
    timeid: {
      type: Sequelize.UUID,
      allownull: false
    },
    Salary: {//通常給金
      type: Sequelize.INTEGER,
      allownull: true
    },
    allowance: {//深夜勤務などの手当給金
      type: Sequelize.INTEGER,
      allonull: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

//tf文字列での5分１文字で扱う保存方法をしよう

module.exports = Affiliations;