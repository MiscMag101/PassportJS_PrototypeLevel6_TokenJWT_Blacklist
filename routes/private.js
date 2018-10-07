var express = require('express');
var router = express.Router();

//Greeting
router.get('/greeting', function(req, res, next) {
  //res.send("Hello " + req.user.username + "!");
  res.render('private', { username: req.user.username});
});

module.exports = router;
 
