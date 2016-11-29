//schedule model

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Schedule = new Schema({
	hangoutId: {
		type: String,
		required: true,
	},
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	},
	username: {
		type: String,
		required: true
	},
	availability: [{
		type: Date,	
		required: true
	}]
});

module.exports = mongoose.model('Schedule', Schedule);