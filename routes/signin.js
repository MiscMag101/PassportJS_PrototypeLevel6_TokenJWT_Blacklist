// Import Express module
const express = require('express');
const router = express.Router();

// Passport Setup
const MyPassport = require('passport');

// Import JWT module and UUID tool
const jwt = require('jsonwebtoken');
const uuidv4 = require('uuid/v4')

// route to start OAuth2 authentication flow with Github
router.get('/github',MyPassport.authenticate('github'));

// route for callback from GitHub
router.get('/github/callback',
           
  // Get user profile with authorization code and access token
  MyPassport.authenticate('github', {session: false}),
  
  // Issue JSON Web Token
  function(req, res) {
      
    // define the token payload
    let payload = {id: req.user.id, username: req.user.username}
    
    // Define the JWT Identifier with a UUID
    let jti = uuidv4();
    
    // sign the token
    let token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '10m', jwtid: jti, algorithm: 'HS512'});
    
    // send the token in a secure cookie
    res.cookie('token', token, { path: '/', secure: true, httpOnly: true , maxAge: 600000, sameSite: 'strict'});
    res.redirect('/private/greeting');
  }
);

module.exports = router;
 
