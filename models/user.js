const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose')

var User = new Schema({
    firstname:{
        type: String,
        default: ''
    },
    facebookId : String ,
    lastname:{
        type: String,
        default: ''
    },
    admin:  {
        type: Boolean,
        default: false,
        required : true 
    }
});

User.plugin(passportLocalMongoose) ;
module.exports = mongoose.model('User', User);
