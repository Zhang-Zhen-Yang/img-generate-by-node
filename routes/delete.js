var express = require('express');
var path = require('path');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  // console.log(req);
  res.render('delete', { title: 'Delete' });
  // res.sendFile('views/generate.html');
  // console.log('index');
});

module.exports = router;
