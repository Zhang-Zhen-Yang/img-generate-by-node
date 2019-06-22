var express = require('express');
var router = express.Router();

// const canvasG = require('../lib/canvasG');
const canvasG2 = require('../lib/canvasG2');


/* GET home page. */
router.all('/', function(req, res, next) {
  console.log(req.body);
  // process.exit(0);
  // throw new Error('unknow');
  try{
    let action;
    
    action = JSON.parse(req.body.action);
    canvasG2.exec(action).then((result)=>{
      res.json({
        success: true,
        result: result ,
      })
    })
  }catch(e){
    res.json({
      success: false,
      result: `${e}` ,
    })
  }
});

module.exports = router;
