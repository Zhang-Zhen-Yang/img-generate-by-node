var express = require('express');

var router = express.Router();
const deleteAction = require('../lib/deleteAction');

/* GET home page. */
router.all('/', function(req, res, next) {
  let action = (req.body.action || '').trim();
  console.log(action);

  if(!action) {
    res.json({
      success:false,
      msg: '内容不得为空'
    });
  } else {
    deleteAction(action).then((result)=>{
      res.json({
        success: true,
        list: result
      });
    }, ()=>{
  
    })
  }
  
});

module.exports = router;
