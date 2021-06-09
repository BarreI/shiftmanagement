const express = require('express');
const Users = require('../models/user');
const uuid = require('uuid');
const router = express.Router();

router.get('/:token', function (req,res,next) {
  let token = req.params.token;
  Users.findOne({
    where: {
      addresstoken: token
    }
  }).then((flag) => {
    if(flag){
      console.log("二段階認証登録完了")
      Users.update(
        {flag: 'true'},
        {where: {addresstoken:token}}
      );
      res.redirect('/homepage')
    }else{
      console.log("トークンが一致しません");
      res.redirect('/login')
    }
  })
})

module.exports = router;