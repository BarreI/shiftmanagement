const express = require('express');
const Users = require('../models/user');
const Stores = require('../models/store');
const Affiliations = require('../models/affiliation');
const Shifts = require('../models/shift');
const Check = require('./check.js');
const router = express.Router();

router.get('/',  async function (req, res) {
  let result = await Check(req.session.authentication, req.session.user);
  if (result[0] && result[1]) {
    let joinedstore = [];
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
    }).then((data) => { //データが場合の処理
      if(data[0]){
        console.log(data[0].affiliationid);
        console.log(data[0].store.storeid); //これがurlになる
        for(var i = 0;i < userdata.storecount;i++){
          joinedstore.push(data[i].store.storeid);
        }
        console.log(joinedstore);
        res.render('homepage', {title:"ホームページ", user:userdata.username , store: joinedstore});
      }else{
        res.render('homepage', {title:"ホームページ", user: userdata.username ,store: ['まだどこにも所属していません']});
      }
    })
  }else if(result[0]){
    res.redirect('/resend');
  }else{
    console.log("非認証ユーザー");
    res.redirect('/login');
  }
})

//aff を検索時にstoreからstorepage に必要なurlをとってきてhtmlに反映

router.get('/mypage', async function (req,res,next) { 
  let result = await Check(req.session.authentication, req.session.user);
  if(result[0] && result[1]){
    //データの全表示

  }else if(result[0]){
    //二段階認証を有効にしてもらう
    res.redirect('/resend');
  }else{
    console.log("非認証ユーザー");
    res.redirect('login');
  }
})

module.exports = router;
