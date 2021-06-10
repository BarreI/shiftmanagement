const express = require('express');
const NodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');
const Users = require('../models/user');
const uuid = require('uuid');
const { render } = require('ejs');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('login', {title: 'ログイン'});
});

router.post('/', function (req, res, next) {
  if(/^[0-9a-zA-Z]{3,15}$/.test(req.body.userid)) {
    console.log("投げられている")
    Users.findOne({
      where: {
        userid: req.body.userid,
      }
    }).then((userData) => {
      if(!userData){
        console.log("未登録ユーザー");
        res.render('login',{title:"ログイン"});
        //TODO  未登録で弾かれた場合のユーザーへの通知
      }else{
        bcrypt.compare(req.body.pass, userData.pass).then(function(result, err) {
          if(result){
            let session = uuid.v4();
            Users.update(
              { session: session },
              { where: { systemid: userData.systemid}}
            )
            req.session.authentication = session;
            req.session.user = userData.systemid;
            console.log(req.session.authentication);
            console.log(req.session.user);
            res.redirect('/homepage');
            console.log("ログイン完了")
          } else {
            console.log("パスワードが間違っています");
          }
        })
      }
    })
  }else{
    console.log("入力に不備があります");
  }
});

module.exports = router;