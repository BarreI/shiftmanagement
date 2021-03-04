const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();

router.get('/', function(req, res, next) {
  res.render('account', { title: 'Express' });
});

module.exports = router;
