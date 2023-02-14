const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    Username : {
        type: String,
        unique : true,
        // required : true
    },
    Name : {
        type: String,
        unique : false,
        // required : true
    },
    email : {
        type: String,
        unique : false,
        // required : true
    },
    mobile : {
        type: String,
        unique : false,
        // required : true
    },
    gender :
    {
        type: String
    },
    image_file :
    {
        type: String,
        unique : false
    },
    url:{
        type: String,
        unique : false
    }
    
})

module.exports =mongoose.model("userprofiles",schema);