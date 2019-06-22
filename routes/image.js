var express = require('express');
var router = express.Router();
const cacheImageFiles = require('../lib/cacheImageFiles.js');

/* GET users listing. */
router.get('/:action/:name', function(req, res, next) {
  // console.log(req.params.name);
  let action = req.params.action;
  let name = req.params.name;
  console.log(action);
  if(action == 'list') {
    res.json(Object.keys(cacheImageFiles));
  }else  if(action == 'delete') {
    let fileArrayBuffer = cacheImageFiles[name];
    if(fileArrayBuffer) {
      delete cacheImageFiles[name]
      res.json({
        success: true,
      })
    } else {
      res.status(404).send('Sorry, we cannot find that!');
    }
  } else if(action == 'get' || action == 'getanddelete'){
    // console.log(cacheImageFiles);
    let fileArrayBuffer = cacheImageFiles[name];
    if(fileArrayBuffer) {
      res.set({'Content-Type': 'image/png'});
      //console.log('有');
      res.send(fileArrayBuffer);
      if(action == 'getanddelete') {
        delete cacheImageFiles[name];
      }
    } else {
      res.status(404).send('Sorry, we cannot find that!');
    }
  } else {
    res.send(`unknow action ${action} in [list, delete, get, getanddelete]`);
  }
  //res.send(`respond with a ${name}`);
});

module.exports = router;
