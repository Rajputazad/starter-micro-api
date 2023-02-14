const jwt = require("jsonwebtoken");
require("../index")
require("dotenv").config();
const config = process.env;

const auth = (req, res, next) => {
  
  // console.log(req.headers)
  const token =req.cookies.token||req.body.authorization  || req.headers.authorization;
  // let cookie=req.cookies.token
  // res.setHeader('authorization',cookie );
  if (!token) {
    return res.status(403).send("A token is required for authentication");
  }
  else{
  try {
    const decoded = jwt.verify(token, config.SECRET_KEY);
    req.decoded = decoded;
  } catch (err) {
    return  res.status(401).send("Invalid Token");
  }
  return next();}
};

module.exports = auth;