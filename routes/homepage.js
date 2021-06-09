const express = require('express');
const Users = require('../models/user');
const Stores = require('../models/store');
const Affiliations = require('../models/affiliation');
const Check = require('./check.js');
const router = express.Router();

router.get('/',  async function (req, res) {
  let result = await Check(req.session.authentication, req.session.user);
  if (result[0]) {
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
      res.render('homepage', {title:"ホームページ", user:result[1].username});
    })
  }else{
    console.log("非認証ユーザー");
    res.redirect('/login');
  }
})

module.exports = router;
