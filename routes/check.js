const express = require('express');
const Users = require('../models/user');

//TODO 日時の計算を実装 セッションの時間管理

module.exports = async (authentication, user) => {
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
    if (authentication == result.session && result.flag == true) {
      console.log("認証成功 二段階認証ユーザ");
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