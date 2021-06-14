const express = require('express');
const NodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');
const Users = require('../models/user');
const uuid = require('uuid');
const { Op } = require('sequelize');
const { env } = require('process');
require('dotenv').config();
const router = express.Router();

router.get('/', function (req, res, next) {
  res.render('account', { title: '新規作成' });
});

router.post('/', function (req, res, next) {
  //TODO ifで分類分けしたので適切なエラーメッセージをUIに反映する
  /**
   * idが2文字以下16文字以上の場合
   * メールアドレスが有効でない場合
   * passが一致しない場合
   * pass に大文字小文字数字が使われた 半角英数字の文字列であること
   */
  if (!/^[0-9a-zA-Z]{3,15}$/.test(req.body.userid)) {
    console.log("ユーザーIDに不備があります");
    res.redirect('/');
  } else if (!/^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(req.body.address)) {
    console.log("有効なメールアドレスを利用してください");
    res.redirect('/');
  } else if (!/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])/.test(req.body.pass)) {
    console.log("passwordには大文字小文字を含む英数字で入力してください");
    res.redirect('/');
  } else if (req.body.pass != req.body.pass_2) {
    console.log("passwordが一致しません同じpasswordを入力してください");
    res.redirect('/');
  } else {
    let addresstoken = uuid.v4();
    Users.findOrCreate({
      where: {
        [Op.or]: [{ userid: req.body.userid }, { address: req.body.address }]
      },
      defaults: {
        systemid: uuid.v4(),
        userid: req.body.userid,
        username: req.body.username,
        address: req.body.address,
        pass: passHash(req.body.pass),
        storecount: 0,
        addresstoken: addresstoken,
        flag: false,
      }
    }).then(([user, created]) => {//user: object created : boolean
      if (created) {
        console.log("該当データが存在しなかったため新規作成しました");
        function sendMail(smtpData, mailData) {
          const transporter = NodeMailer.createTransport(smtpData)
          transporter.sendMail(mailData, function (error, info) {
            if (error) {
              console.log(error)
            } else {
              console.log('Email sent: ' + info.response)
            }
          })
        }
        function main() {
          const smtpData = {
            host: 'smtp.gmail.com',
            port: '465',
            secure: true,
            auth: {
              user: env.nodemaileruser,
              pass: env.nodemailerpass,
            }
          }
          const mailData = {
            from: '"シフト作成管理サイト クムシフ" <' + smtpData.auth.user + '>',
            to: req.body.address,
            subject: 'クムシフ 二段階認証',
            text: '登録には以下のURLをクリックしてください \n' + 'http://localhost:8000/auth/' + addresstoken,
            html: '<b>登録には以下のURLをクリックしてください \n' + 'http://localhost:8000/auth/' + addresstoken + '</b>',
          }
          sendMail(smtpData, mailData)
        }
        main();
        res.redirect('/login');
      }else{
        if(user.systemid === req.body.userid){
          console.log("該当idデータあり");
          res.redirect('/');
        }else if(user.address === req.body.address){
          console.log("該当アドレスデータあり");
          res.redirect('/');
        }
      }
    })
  }
});

function passHash(value) {
  let salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(value, salt);
}

module.exports = router;
