const express = require('express');
const Users = require('../models/user');
const Stores = require('../models/store');
const Affiliations = require('../models/affiliation');
const Check = require('../routes/check');
const uuid = require('uuid');
const router = express.Router();

router.get('/', async function (req,res,next) {
  let result = await Check(req.session.authentication, req.session.user);
  if(result[0]){
    console.log("ばなな")
    res.render('join')
  }
});

router.get('/:storeid',async function (req,res,next) {

});

router.post('/', function (req,res,next) {
  console.log("store検索前")
  Stores.findOne({
    where:{
      storeid:req.body.name
    }
  }).then((store) => {//TODO 招待とりくえすとが重複した時
    console.log("join post")
    if(store){
      Affiliations.create({
        affiliationid: uuid.v4(),
        systemid: req.session.user,
        storeid:store.storeid,
        joined:false
      })
      console.log("リクエストソウシンカンリョウ");
      res.redirect('./homepage');
    }else{
      console.log("店が存在していません");

    }
  })
})

module.exports = router;