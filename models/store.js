'use strict'
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Stores = loader.database.define (
  'stores',
  {
    storeid:{
      type: Sequelize.STRING,
      primaryKey: true,
      allownull: false
    },
    storename:{
      type: Sequelize.STRING,
      allownull: false
    },
    ownerid:{
      type: Sequelize.UUID,
      allownull: false
    },
    comment:{
      type: Sequelize.TEXT,
      allownull: true
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Stores;

/**
 * ガンとチャートを作る上で明らかに必要なこと
 * 営業時間
 * 給金
 * 営業日
 * 
 */