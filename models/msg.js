const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const msgSchema = new Schema ({
    firstName :{
        type : String ,
        required : true

    },
    lastName : {
        type : String ,
        required: true
    },
    email : {
        type : String,
        required: true
    },
    tel : {
        type : String ,
        required: true
    },
    feedback : {
        type : String ,
        required: true
    }

})

Msg = mongoose.model('Msg',msgSchema) ;
module.exports =  Msg ;
