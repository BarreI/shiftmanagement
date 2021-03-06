const express = require('express');
const Users = require('../models/user');

//TODO日時の計算を実装 セッションの時間管理

module.exports = (authentication, user) => {
  if (!authentication || !user) {
    console.log("値が存在しません");
    return false;
  } else {
    Users.findOne({
      where: {
        systemid: user
      }
    }).then((userData) => {
      if (authentication == userData.session) {
        console.log("認証成功");
        return [true, userData]
      } else {
        console.log("認証失敗");
        return [false, null];
      }
    })
  }
}