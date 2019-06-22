var express = require('express');
var router = express.Router();

// const canvasG = require('../lib/canvasG');
const canvasGSingle = require('../lib/canvasGSingle');


/* GET home page. */
router.get('/:action', function(req, res, next) {
  let action = req.params.action;
  console.log(action);
  if(action == 'image') {
    let query = req.query;
    let {goods_image, template_image, data,  price} = query;
    console.log(typeof pic == 'undefined');
    if((typeof goods_image == 'undefined') || (typeof template_image == 'undefined') || (typeof data == 'undefined') || (typeof price == 'undefined')) {
      // res.set({'Content-Type': 'image/png'});

      res.status(404).send('少参数');
    } else {
      let item  = (new Function(`return ${data}`))();
      item.layers.unshift(
        {
          "type":"pic",
          "image": goods_image,
          "left":0,
          "top":0,
          "width":item.canvasWidth,
          "height":"auto"
        }
      );
      item.layers.unshift(
        {
          "type":"pic",
          "image":template_image,
          "left":0,
          "top":0,
          "width":item.canvasWidth,
          "height":"auto"
        }
      );
      canvasGSingle.exec(item, price).then((result)=>{
        res.set({'Content-Type': 'image/png'});
        res.send(result.buffer);
        // res.send(result.name);
      }, (result)=>{
    
      })
    }
    console.log(req.query);
  } else {
    let item  = (new Function(`return ${action}`))()
    console.log('item-----------------------------------------------------', item);
  
    canvasGSingle.exec(item).then((result)=>{
      res.set({'Content-Type': 'image/png'});
      res.send(result.buffer);
      // res.send(result.name);
    }, (result)=>{
  
    })
  }
  
});

module.exports = router;
