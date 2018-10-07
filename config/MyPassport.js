// Import User model
const MyUser = require('../models/user.js');

// Import Passport middleware
const MyPassport = require('passport');

// Import GitHub Strategy for Passport
const MyGitHubStrategy = require('passport-github').Strategy;

// Configure the new GitHub Strategy for Passport
MyPassport.use(new MyGitHubStrategy(
  
  // Settings for GitHub Strategy
  {
    clientID: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
    callbackURL: "https://" + process.env.HOST + ":" + process.env.PORT + "/signin/github/callback",
    scope: "read:user"
  },
  
  // Verification function
  function(accessToken, refreshToken, profile, done) {
    
    MyUser.findOrCreate(profile, function (err, user) {
      
      // If technical error occurs (such as loss connection with database)
      if (err) {
        return done(err);
      }
      
      // If user doesn't exist (this case should never happen with this Strategy because a new user will be automatically created)
      if (!user) {
        return done(null, false);
      }
      
      // If everything all right, the user will be authenticated
      return done(null, user);
        
    });
               
  }

));



// Import Cookie Strategy for Passport
const MyCookieStrategy = require('passport-cookie').Strategy;

// Import JWT module
const jwt = require('jsonwebtoken');

// Redis Setup
const MyRedis = require('redis');
const MyRedisClient = MyRedis.createClient();

// Configure the cookie Strategy for Passport
MyPassport.use(new MyCookieStrategy(

  function (token, done) {
    
    // Check JWT
    jwt.verify(token, process.env.JWT_SECRET, function(err, payload) {
      
      // If checking failed
      if (err) {
        return done(err);
      }
      
      // If user is empty
      if (!payload){
        return done(null, false);
      }
      
      // If token is revoked
      MyRedisClient.get(payload.jti, function (err, value) {
        
         // If checking failed
        if (err) {
          return done(err);
        }
      
        // If JWT is revoked
        if (value !== null) {
          console.log("JWT " + payload.jti + "is revoked !");
          return done(null, false);
        }
    
        // If everything all right, the user will be authenticated
        return done(null, payload);
        
      });

  });
}));


// Export passport object
module.exports = MyPassport
 
