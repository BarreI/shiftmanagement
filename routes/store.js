const express = require('express');
const Users = require('../models/user');
const Stores = require('../models/store');
const Affiliations = require('../models/affiliation');
const Shifts = require('../models/shift');
const Check = require('./check.js');
const router = express.Router();

//参加していないユーザーを弾く処理
//エラーメッセージは存在しないと返すこと　存在を悟られないようにそうしてるがどうするか未定
router.get('/:id', async function (req, res) {
  console.log("storefile");
  let result = await Check(req.session.authentication, req.session.user);
  if (result[0] && result[1]) {
    let storeid = req.params.id;
    //中身に変更を加える
    /**
     * user は参加してるかどうかを調べるだけなので
     * attribute で joined のみを指定する
     * 
     * そのあとに表示するデータを検索して表示する
     */
    try {
      let user = await Affiliations.findOne({
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
      let joinedUser = await Affiliations.findAll({
        where: {
          storeid: storeid,
          joined: true
        }
      });
      let invitedUser = await Affiliations.findAll({
        include: [
          {
            model: Users
          }
        ],
        where: {
          storeid: storeid,
          joined: false
        }
      });
      let joinedList = [];
      let invitedList = [];

      for(var i=0;i<joinedUser.length;i++){
        joinedList.push(joinedUser[i].systemid);
      }
      for(var j=0;j<invitedUser.length;j++){
        invitedList.push(invitedUser[j].systemid);
      }
      console.log(joinedList);
      console.log(invitedList);
      if (user.joined && req.session.user === user.store.ownerid) {
        console.log("所有ユーザー");
        if(user.timeid === null){
          console.log("ﾍﾟﾛ これはnullの味");
          res.redirect('/store/' +storeid+ '/time');
        }
        //今は４つだが将来的にはシフトデータも渡す
        res.render('store', {
          userList: joinedList,
          owner: "YES",
          invitedUser: invitedList
        })
      } else if (user.joined) {
        console.log("所属ユーザー")
        res.render('store', {
          userList: joinedList,
          owner: "NO"
        });
      } else {
        console.log("あなたはこの店に所属していません");
        res.redirect('/homepage');
      }
    } catch (e) {
      console.log(e);
      res.redirect('/homepage');
    }
  } else if (result[0]) {
    //二段階認証を有効にしてもらう
    res.redirect('/resend');
  } else {
    console.log("非認証ユーザー");
    res.redirect('/login');
  }
});

router.get('/:id/time', function(req,res,next) {
  res.render('time');
})

module.exports = router;