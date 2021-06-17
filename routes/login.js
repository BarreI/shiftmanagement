const express = require('express');
const NodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');
const Users = require('../models/user');
const uuid = require('uuid');
const { Op } = require('sequelize');
const { render } = require('ejs');
const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('login', { title: 'ログイン' });
});

router.post('/', function (req, res, next) {
  console.log("投げられている")
  Users.findOne({
    where: {
      [Op.or]: [{ userid: req.body.useridOraddress }, { address: req.body.useridOraddress }]
    }
  }).then((userData) => {
    if (!userData) {
      console.log("未登録ユーザー");
      res.redirect('/');
      //TODO  未登録で弾かれた場合のユーザーへのメッセージ
    } else {
      bcrypt.compare(req.body.pass, userData.pass).then(function (result, err) {
        if (result) {
          let session = uuid.v4();
          Users.update(
            { session: session },
            { where: { systemid: userData.systemid } }
          )
          req.session.authentication = session;
          req.session.user = userData.systemid;
          console.log(req.session.authentication);
          console.log(req.session.user);
          res.redirect('/homepage');
          console.log("ログイン完了")
        } else {
          console.log("パスワードが間違っています");
          res.redirect('/login');
        }
      })
    }
  })
});

module.exports = router;