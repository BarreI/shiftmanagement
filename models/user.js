'use strict'
const loader = require('./sequelize-loader');
const Sequelize = loader.Sequelize;

const Users = loader.database.define(
  'users',
  {
    systemid: {
      type: Sequelize.UUID,
      primaryKey: true,
      allownull: false
    },
    userid: {
      type: Sequelize.STRING,
      allownull:false
    },
    username: {
      type: Sequelize.STRING,
      allownull:false
    },
    address: {
      type: Sequelize.STRING,
      allownull:false
    },
    addresstoken: {
      type: Sequelize.UUID,
      allownull:false
    },
    flag: {
      type: Sequelize.BOOLEAN,
      allownull: false
    },
    pass: {
      type: Sequelize.STRING,
      allownull:false
    },
    storecount: {
      type: Sequelize.INTEGER,
      allownull: false
    },
    session: {
      type: Sequelize.UUID,
      allownull:true
    }
  },
  {
    freezeTableName: true,
    timestamps: true
  }
);

module.exports = Users;