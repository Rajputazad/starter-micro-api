const mongoose = require("mongoose");
const OTPSchema = new mongoose.Schema({
  Email: String,
  Otp : {
    type: String,
    unique : [true,"Try again"],
    required : [true, 'Otp required'],
    minlength:[6,"Please enter six digit code"],
    maxlength:[6,"Please enter six digit code"]
},
    expireAt: {
      type: Date,
      default: Date.now,
      index: { expires: '5m' },
    }

});

module.exports = mongoose.model("OTPs", OTPSchema);
