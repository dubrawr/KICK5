// dependencies
var express = require('express');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressSession = require('express-session');
var mongoose = require('mongoose');
var hash = require('bcrypt-nodejs');
var path = require('path');
var passport = require('passport');
var localStrategy = require('passport-local' ).Strategy;

// need to requier config js file, that leads to Mlab url to hose mongo
// var config = require('../config.js');


// mongoose
mongoose.connect('mongodb://localhost/mean-auth');
// mongoose.connect(config.DATABASE_URL);

// user schema/model
var User = require('./models/user.js');
var Hangout = require('./models/hangout.js');
var Schedule = require('./models/schedule.js');

// create instance of express
var app = express();

// require routes
var userRoutes = require('./routes/api.js');
var scheduleRoutes = require('./routes/scheduleApi.js');

// define middleware
app.use(express.static(path.join(__dirname, '../client')));
app.use(express.static(path.join(__dirname, '../bower_components')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(require('express-session')({
    secret: 'secretsquirrel',
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static(path.join(__dirname, 'public')));

// configure passport
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// routes
app.use('/user/', userRoutes);
app.use('/schedule/', scheduleRoutes);

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '../client', 'index.html'));
});

// error hndlers
app.use(function(err, req, res, next) {
  // var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// app.use(function(err, req, res) {
//   //this is causing an error not sure why
//   res.status(err.status || 500);
//   res.end(JSON.stringify({
//     message: err.message,
//     error: {}
//   }));
// });

module.exports = app;

// app.get('/hangouts', function(request, response){
//     Hangout.find({owner: request.user}, function(err, results){
//         console.log(results);
//         response.json(results);
//     });

// });
















