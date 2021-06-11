const express = require('express');
const Users = require('../models/user');

module.exports = async (authentication, user, file) => {
  console.log("Check通ってます")
  if (!authentication || !user) {
    console.log("値が存在しません");
    return false;
  } else {
    let result = await Users.findOne({
      where: {
        systemid: user
      }
    });
    if (authentication == result.session && result.flag) {
      console.log("認証成功 二段階認証ユーザ");
      switch(file){
        case homepage:
          //User Aff Storeが必要
        case mypage:
          //User Aff Store Shiftsが必要
      }
      return [true, true];
    } else if(authentication == result.session){
      console.log("認証成功 二段階認証を有効にしてください");
      return [true, false];
    }else{
      console.log("認証失敗");
      return[false, false];
    }
  }
}

//check に引数を増やして 例: authentication user file名

//チェックの中で必要データを調べて返すことによってごちゃごちゃ感を減らせる