const express = require('express');
const Affiliations = require('../../models/affiliation');
const router = express.Router();

async function affStore(num){
  await Affiliations.findAll({
    attributes:['storeid'],
    where: {
      systemid: req.session.systemid
    }
  })
}

Vue.createApp({
  data() {
    return {
      stores: [
        {storename: affStore(0)}
      ]
    }
  }
})