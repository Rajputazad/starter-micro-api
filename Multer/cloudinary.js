const cloudinary = require('cloudinary');
require("dotenv").config();
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key:  process.env.api_key,
  api_secret: process.env.api_secret
});

module.exports = cloudinary;