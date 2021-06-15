const express = require('express');
const Users = require('../models/user');
const Stores = require('../models/store');
const Affiliations = require('../models/affiliation');
const Check = require('./check.js');
const router = express.Router();

//homepageには入れるがurlを踏めないようにする
//行けるところは基本的にmypageのみ
//そこらへんのもろもろの処理書いてね <3

router.get('/',  async function (req, res) {
  let result = await Check(req.session.authentication, req.session.user);
  if (result[0] && result[1]) {
    let userdata = await Users.findOne({
      where: {
        systemid: req.session.user
      }
    });
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
      res.render('homepage', {title:"ホームページ", user:userdata.username});
    })
  }else if(result[0]){
    //TODO に段階認証を有効化するように促す
    res.redirect('/resend');
  }else{
    console.log("非認証ユーザー");
    res.redirect('/login');
  }
})

router.get('/mypage', async function (req,res,next) { 
  let result = await Check(req.session.authentication, req.session.user);
  if(result[0]){
    //TODO 自身のプロフィール閲覧変更
  }else{
    console.log("非認証ユーザー");
    res.redirect('/login');
  }
})

module.exports = router;
