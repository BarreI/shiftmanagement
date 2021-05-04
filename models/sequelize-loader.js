'use strict'
const Sequelize = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:postgres@localhost/shiftdb');

module.exports = {
  database: sequelize,
  Sequelize: Sequelize
};

//indexは知識不足のためなし＾