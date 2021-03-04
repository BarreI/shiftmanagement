'use strict'
const Sequelize = require('sequelize');
const sequelize = new Sequelize(env.dbadress);

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};

//indexは知識不足のためなし