'use strict'
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Stores = loader.database.define (
  'stores',
  {
    storeid:{
      type: Sequelize.UUID,
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
    commnet:{
      type: Sequelize.TEXT,
      allownull: false
    }
  },
  {
    freezeTableName: true,
    timestamps: false
  }
);

module.exports = Stores;