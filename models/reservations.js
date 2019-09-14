const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const reservationSchema = new Schema ({
    name :{
        type : String ,
        required : true

    },
    date : {
        type : Date,
        required: true
    },
    time : {
        type : String ,
        required: true
    },
    number : {
        type : Number ,
        required: true
    },
    ville :{
        type : String ,
        required : true
    },
    tel :{
        type : String ,
        required : true
    }

})

Reservations = mongoose.model('Reservations',reservationSchema) ;
module.exports =  Reservations ;
