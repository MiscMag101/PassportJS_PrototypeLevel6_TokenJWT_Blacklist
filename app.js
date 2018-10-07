
// MongoDB setup
const MyMongoose = require('mongoose');

MyMongoose.connect(process.env.MONGOURI,{ useNewUrlParser: true })
.then(() => {
    console.log("Successfully connected to MongoDB.");    
  }).catch(err => {
    console.log('Could not connect to MongoDB.');
    process.exit();
  });
  
// Setup Redis
const MyRedis = require('redis');
const MyRedisClient = MyRedis.createClient();

MyRedisClient.on('connect', function(){
    console.log('Successfully connected to Redis');
});

MyRedisClient.on('error', function(err) {
     console.log('Redis error: ' + err);
     process.exit();
});

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

// Load Route
var indexRouter = require('./routes/index');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


// Passport Setup
const MyPassport = require('./config/MyPassport.js');
app.use(MyPassport.initialize());

// route
app.use('/', indexRouter);

// route for signin
const SigninRouter = require('./routes/signin.js');
app.use('/signin', SigninRouter);

// route for signout
const SignoutRouter = require('./routes/signout.js');
app.use('/signout', MyPassport.authenticate('cookie', {session: false}), SignoutRouter);

// Restricted route
const PrivateRouter = require('./routes/private.js');
app.use('/private', MyPassport.authenticate('cookie', {session: false}), PrivateRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
