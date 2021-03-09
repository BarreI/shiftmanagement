const express = require('express');
const Users = require('../models/user');
const Stores = require('../models/store');
const Affiliations = require('../models/affiliation');
const Check = require('../routes/check');
const uuid = require('uuid');
const router = express.Router();

router.get('/', async function (req, res, next) {
  let result = await Check(req.session.authentication, req.session.user);
  if(result[0]){
    console.log("newstore");
    res.render('newstore', { user: result[1], title: "newstore"});
  }else{
    res.redirect('/login');
  }
});

router.post('/', function (req, res, next) {
  Users.findOne({
    attributes:['storecount'],
    where: {
      systemid: req.session.user
    }
  }).then((counter) => {
    console.log(counter.storecount);
    console.log(typeof counter.storecount);
    if(counter.storecount == 3){
      console.log("作成上限数に達しています");
      res.redirect("/homepage");
    }else{
      let number = counter.storecount + 1;
      Stores.create({
        storeid: uuid.v4(),
        ownerid: req.session.user,
        storename: req.body.name, 
        comment: req.body.comment
      }).then((store) => {
        Affiliations.create({
          affiliationid: uuid.v4(),
          storeid: store.storeid,
          systemid: req.session.user
        })
      })
      Users.update(
        {storecount: number},
        {where:{systemid: req.session.user}}
      ).then(()  =>{
        res.redirect('/homepage');
      })
    }
  })
});

module.exports = router;