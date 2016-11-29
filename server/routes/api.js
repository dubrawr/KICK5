var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var q = require('q');

var User = require('../models/user.js');
var Hangout = require('../models/hangout.js');
var Schedule = require('../models/schedule.js');


router.post('/register', function(req, res) {
  User.register(new User({ username: req.body.username }),
    req.body.password, function(err, account) {
      if (err) {
        console.log(err);
        return res.status(500).json({
          err: err
        });
      }
      passport.authenticate('local')(req, res, function () {
        return res.status(200).json({
          status: 'Registration successful!'
        });
      });
    });
});

router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err);
    }
    if (!user) {
      return res.status(401).json({
        err: info
      });
    }
    req.logIn(user, function(err) {
      if (err) {
        return res.status(500).json({
          err: 'Could not log in user'
        });
      }
      res.status(200).json({
        status: 'Login successful!',
        username: user.username
      });
    });
  })(req, res, next);
});

router.get('/logout', function(req, res) {
  req.logout();
  res.status(200).json({
    status: 'Bye!'
  });
});

router.get('/status', function(req, res) {
  if (!req.isAuthenticated()) {
    return res.status(200).json({
      status: false
    });
  }
  res.status(200).json({
    status: true,
    username: req.user.username
  });
});

//hangouts
router.post('/hangouts', function(request, response) {
  var location = request.body.location;
  var place = request.body.place;
  var owner = request.user;
  // console.log('this is the owner:' + owner);

  var hangoutName = request.body.hangout.trim();

  var invited = request.body.invited.trim();
  // console.log(invited);

  var startDate = request.body.startDate.trim();
  var endDate = request.body.endDate.trim();

  var createdHangout = new Hangout({
    hangout: hangoutName,
    invited: invited.split(' '),
    startDate: startDate,
    endDate: endDate,
    owner: owner,
    place: place,
    location: location

  });
  // console.log(request.user + 'this is the request.user');
  Hangout.find({hangout: hangoutName}, function(err, results){
    if (results.length !== 0){
      return response.status(409).json({message: 'hangout already exists'});
    } else {
            //was erroring because hangout name already existed so had to add the above ^
            createdHangout.save(function(err) {
              if (err) {
                console.log(err);
                return response.status(500).json();
              }
              console.log(createdHangout + 'this is the created hangout');
              return response.status(201).json();
            });
          }

        });
});
// i need to have this GET search the invited arrays as well for request.user
router.get('/hangouts', function(request, response){

  // console.log(request.user);
  q.all([
    Hangout.find({owner: request.user}).populate('owner').exec(),
    Hangout.find({invited: request.user.username}).exec()
    ]).then(function(results){
      var owned = results[0];
      var invited = results[1];
      //concat joins two arrays
      // console.log('this is the concat');
      // console.log(owned.concat(invited));
      response.json(owned.concat(invited));
    });

});

router.get('/hangouts/:id', function(request, response){
  Hangout.find({_id: request.params.id}).populate('owner').exec(function(err,results){
    console.log(results);
    response.json(results);
  });
});

router.delete('/hangouts/:id', function(request, response){
  console.log(request.user);
  Hangout.findOneAndRemove({_id: request.params.id, owner: request.user}, function(err, result){
    if (err || !result){
      console.log('error deleting');
      return response.status(500).json();
  } else {
    console.log('delete success');
      return response.status(200).json();
  }
});

// router.post('/hangouts/:id', function(request, response){
//   console.log('post');
//   console.log(request.body);
//   Hangout.find({_id: request.params.id}, function(err, result){
//     console.log(request.body);
//     if (result) {
//         result.location = request.body.location;
//       }

//   });
// });

router.get('/schedule/:id', function(request,response){
  Schedule.findOne({hangoutId: request.params.id, user: request.user}, function(err,results){
    console.log('SCHEDULE GET RESULTS: from REGULAR API'+ results);
    // console.log(results + ' these are the results for schedule GET');
    response.json(results);

  });
});

});

module.exports = router;