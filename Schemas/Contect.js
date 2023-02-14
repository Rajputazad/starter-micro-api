const mongoose = require("mongoose")
const schema= new mongoose.Schema({
    Name : {
        type: String,
        unique : false,
        required: [true, 'User Name required'],
        minlength:[2,"Minimum 2 letters in Name"],
        maxlength:10
    },
    Email : {
        type: String,
        unique : false,
        required : [true, 'User Email required'],
        validate: {
            validator: function(v) {
                return  /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
            },
            message: props => `${props.value} is not a valid Email !`
          },
    },
    Phone : {
        type: Number,
        unique : false,
        required : [true, 'User Phone number required'],
        validate: {
            validator: function(v) {
              return /^[6-9]\d{9}$/.test(v);
            },
            message: props => `${props.value} is not a valid phone number!`
          },
    },
    Disc : {
        type: String,
        unique : false,
        maxlength:500
        // required : true
    },
    createdAt: {type: Date, default: Date.now}

})
module.exports=mongoose.model("Contect",schema)