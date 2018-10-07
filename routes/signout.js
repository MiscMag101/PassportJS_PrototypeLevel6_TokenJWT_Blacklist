var express = require('express');
var router = express.Router();

// Redis Setup
const MyRedis = require('redis');
//const MyRedisClient = MyRedis.createClient();
const MyRedisClient = MyRedis.createClient({
  no_ready_check: true,
  password: process.env.REDIS_PASSWORD
});

// Signout page
router.get('/', function(req, res) {
  
  // Add JWT in the blacklist and set expiration time
  MyRedisClient.set(req.user.jti,'1');
  MyRedisClient.expireat(req.user.jti, req.user.exp);
  
  res.redirect('/');
});

module.exports = router; 
