// hangout model
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var Hangout = new Schema({
    hangout: {
        type: String,
        required: true,
        unique: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    invited: [{
        type: String,
        required: false
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'},
    location: {
        type: Object,
        required: false
    },
    place: {
        type: String,
        required: false
    }
});

module.exports = mongoose.model('Hangouts', Hangout);
