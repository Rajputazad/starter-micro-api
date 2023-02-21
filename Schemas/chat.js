const mongoose = require("mongoose")
const schema = new mongoose.Schema({
    Username : {
        type: String,
        // unique : true,
        required : true
    },
    Chat:{
        type: String,
    }
    
},{timestamps:true})

module.exports =mongoose.model("Users",schema);