const express = require('express');
const NodeMailer = require('nodemailer');
const bcrypt = require('bcrypt');
const Users = require('../models/user');
const uuid = require('uuid');
const { Op } = require('sequelize');
const { env } = require('process');
require('dotenv').config();
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('account', { title: '新規作成' });
});

router.post('/', function (req, res, next) {
  //TODO ifの中に全て詰め込むのではなくswitchcaceで分類してエラー表示
  if(/^[0-9a-zA-Z]{3,15}$/.test(req.body.userid) && /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(req.body.address) && req.body.userid === req.body.userid_2){
    let addresstoken = uuid.v4();
    Users.findOrCreate({
      where: {
        [Op.or] : [{userid: req.body.userid}, {address: req.body.address}]
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
    }).then(([user, created]) => {
      if(created){
        console.log("該当データが存在しなかったため新規作成しました");
        function sendMail (smtpData, mailData) {
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
        console.log("useridかaddressがすでに使用されているため登録できません"); //TODO エラーの分岐
        res.redirect('/'); //TODO この処理が走った場合サイト側にもエラーを表示
      }
    })
  }else{
    res.render('account',{ alert: 'improper'});
    console.log("入力データに不備があります"); //TODO errの分岐
  }
});

function passHash(value){
  let salt = bcrypt.genSaltSync(10);
  return bcrypt.hashSync(value, salt);  
}

module.exports = router;
