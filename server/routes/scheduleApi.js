var express = require('express');
var router = express.Router();
var passport = require('passport');
var mongoose = require('mongoose');
var q = require('q');

var User = require('../models/user.js');
var Hangout = require('../models/hangout.js');
var Schedule = require('../models/schedule.js');

router.get('/:id', function(request,response){
  Schedule.find({hangoutId: request.params.id}, function(err,results){
    console.log('SCHEDULE GET RESULTS: FROMSCHEDULEAPI '+ results);
    // console.log(results + ' these are the results for schedule GET');
    response.json(results);

  });
});

router.get('/:id/a', function(request,response){
	console.log(request.params);
  Schedule.find({hangoutId: request.params.id, user:request.user}, function(err,results){
    console.log('IS THIS WORKING '+ results);
    // console.log(results + ' these are the results for schedule GET');
    response.json(results);

  });
});

  router.post('/:id', function(request, response){
    var hangoutId = request.params.id;
    var availability = request.body.availability;
    console.log(request.body.location);
    var location = request.body.location;
    var createdSchedule = new Schedule({
      hangoutId: hangoutId,
      user: request.user,
      availability: availability,
      location: location,
      username: request.user.username
    });
    console.log('this is the hangoutID and request.user below');
    console.log(request.user);
    console.log({hangoutId: hangoutId, user: request.user});
    Schedule.findOne({hangoutId: hangoutId, user: request.user}, function(err, result){

      if (result) {
        result.availability = availability;
        //the guy recommended always find the specific object and use.save
        result.save(function(err){
          if (err){
            return response.status(400).send(err);
          }
            return response.status(200).json();
        });

        console.log(result);


      } else {
        createdSchedule.save(function(err){
          if (err){
            console.log(err);
            return response.status(500).json();
          }
          console.log(createdSchedule + 'this is the created schedule');
          return response.status(201).json();
        });
      }
    });

  });

module.exports = router;