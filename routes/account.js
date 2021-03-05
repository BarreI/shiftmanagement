const express = require('express');
const bcrypt = require('bcrypt');
const Users = require('../models/user');
const uuid = require('uuid');
const { Op } = require('sequelize');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('account', { title: '新規作成' });
});

router.post('/', function (req, res, next) {
  if(/^[0-9a-zA-Z]{3,15}$/.test(req.body.userid) && /^[a-zA-Z0-9_+-]+(.[a-zA-Z0-9_+-]+)*@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/.test(req.body.address)){
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
        storecount: 0 
      }
    }).then(([user, created]) => {
      if(created){
        console.log("該当データが存在しなかったため新規作成しました");
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
