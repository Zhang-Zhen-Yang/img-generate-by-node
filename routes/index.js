var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: '智能标签后台生成图片' });
  console.log('index');
});

module.exports = router;
