const express = require('express');
const Users = require('../models/user');
const Stores = require('../models/store');
const Affiliations = require('../models/affiliation');
const Shifts = require('../models/shift');
const Check = require('./check.js');
const router = express.Router();

//参加していないユーザーを弾く処理
//エラーメッセージは存在しないと返すこと
router.get('/:id', async function(req, res) {
  let result = await Check(req.session.authentication, req.session.user);
  if(result[0] && result[1]){
    let storeid = req.params.id;
    //中身に変更を加える
    /**
     * joinedUser は参加してるかどうかを調べるだけなので
     * attribute で joined のみを指定する
     * 
     * そのあとに表示するデータを検索して表示する
     */
    try{
      let joinedUser = await Affiliations.findOne({
        include: [
          {
            model: Stores
          }
        ],
        where: {
          systemid: req.session.user,
          storeid: storeid
        }
      });
      console.log(joinedUser);
      console.log("aaaaaa");
      console.dir(joinedUser, { depth: 3});
      if(joinedUser.joined && req.session.user === joinedUser.store.ownerid){
        console.log("所有ユーザー");
        //今は４つだが将来的にはシフトデータも渡す
        res.render('store', {
          storename:joinedUser.store.storename, 
          storeid:joinedUser.store.storeid,
          owner: 'YES',
          comment: joinedUser.store.comment
        })
      }else if(joinedUser.joined){
        console.log("所属ユーザー")
        res.render('store', {
          storename:joinedUser.store.storename, 
          storeid:joinedUser.store.storeid,
          owner: joinedUser.store.ownerid,
          comment: joinedUser.store.comment
        });
      }else{
        console.log("あなたはこの店に所属していません");
        res.redirect('/homepage');
      }
    }catch(e){
      console.log(e);
      res.redirect('/homepage');
    }
  }else if(result[0]){
    //二段階認証を有効にしてもらう
    res.redirect('/resend');
  }else{
    console.log("非認証ユーザー");
    res.redirect('/login');
  }
})

module.exports = router;