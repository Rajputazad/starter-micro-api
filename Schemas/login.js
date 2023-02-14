const mongoose = require("mongoose");
const LoginSchema = new mongoose.Schema({
  Name: {
    type: String,
    require: true,
  },
  Email : {
    type: String,
    unique : [true,"that Email is taken. try another"],
    required : [true, 'User Email required'],
    validate: {
        validator: function(v) {
            return  /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/.test(v);
        },
        message: props => `${props.value} is not a valid Email !`
      },
},
  token: { 
  type: String
 },
  Username: {
    type: String,
    require: true,
    unique: [true,"that Username is taken. try another"]
  },
  Password: {
    type: String,
    require: true,
    // select: false
  }
},{timestamps:true});

module.exports = mongoose.model("LoginDetails", LoginSchema);
