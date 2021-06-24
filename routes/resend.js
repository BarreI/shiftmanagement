const express = require('express');
const Users = require('../models/user');
const Check = require('./check.js');
const NodeMailer = require('nodemailer');
const uuid = require('uuid');
const { env } = require('process');
require('dotenv').config();
const router = express.Router();

router.get('/', async function (req, res, next) {
  let result = await Check(req.session.authentication, req.session.user);
  if (result[0] && result[1]) {
    console.log("認証済みです");
    res.redirect('/homepage');
  } else if (result[0]) {
    console.log("resend対象です");
    Users.findOne({
      where: {
        systemid: req.session.user
      }
    }).then((userdata) => {
      let resendaddress = userdata.address;
      res.render('resend', { mail: resendaddress });
    })
  } else {
    console.log("もう一度ログインしてください");
  }
});

router.get('/change', async function (req, res, next) {
  let result = await Check(req.session.authentication, req.session.user, "resendchange");
  if (result[0] && result[1]) {
    console.log("認証済みです");
    res.redirect('/homepage');
  } else if (result[0]) {
    res.render('resendchange');
  } else {
    console.log("もう一度ログインしてください");
  }
})

//!/^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(req.body.address))
//mailaddress の確認を追加
router.post('/', async function (req, res, next) {
  console.log("resend post");
  console.log(req.body.sendbutton);
  let addresstoken = uuid.v4();
  await Users.update(
    { addresstoken: addresstoken },
    { where: { systemid: req.session.user } }
  );
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
      to: req.body.sendbutton,
      subject: 'クムシフ 二段階認証',
      text: '登録には以下のURLをクリックしてください \n' + 'http://localhost:8000/auth/' + addresstoken,
      html: '<b>登録には以下のURLをクリックしてください \n' + 'http://localhost:8000/auth/' + addresstoken + '</b>',
    }
    sendMail(smtpData, mailData)
  }
  await main();
  res.redirect('/login');
});

router.post('/change', async function (req, res, next) {
  console.log("resendchange post");
  console.log(req.body.changedaddress);
  let addresstoken = uuid.v4();
  if (/^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(req.body.changedaddress)) {
    console.log("メールおっけ");
    await Users.update(
      { address: req.body.changedaddress, addresstoken: addresstoken },
      { where: { systemid: req.session.user } }
    );

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
        to: req.body.changedaddress,
        subject: 'クムシフ 二段階認証',
        text: '登録には以下のURLをクリックしてください \n' + 'http://localhost:8000/auth/' + addresstoken,
        html: '<b>登録には以下のURLをクリックしてください \n' + 'http://localhost:8000/auth/' + addresstoken + '</b>',
      }
      sendMail(smtpData, mailData)
    }
    await main();
    res.redirect('/login');
  } else {
    console.log("有効なメールアドレスを入力してください");
    res.redirect('/resend/change');
  }
})

module.exports = router;

/**
 * メールアドレスを表示してokならそのままsend
 * もし違う場合はinputフォームから送られたきたメールアドレスを元にdbの書き換えとメールの再送を行う
 */