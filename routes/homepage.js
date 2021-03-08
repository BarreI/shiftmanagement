const express = require('express');
const Users = require('../models/user');
const Stores = require('../models/store');
const Affiliations = require('../models/affiliation');
const Check = require('./check.js');
const router = express.Router();

router.get('/', async function (req, res) {
  let result = await Check(req.session.authentication, req.session.user);
  if (result) {
    Affiliations.findAll({
      include: [
        {
          model: Stores,
          attributes: ['storeid','storename']
        }
      ],
      where: {
        systemid: req.session.user
      }
    }).then((stores) => {
      console.log(stores);
    })
  }else{
    console.log("homepage else")
  }
})

module.exports = router;
