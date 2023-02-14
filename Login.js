require("dotenv").config();
const datas = require("./Schemas/login");
const express = require("express");
const app = express();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;
var bodyParser = require('body-parser')
app.use(express.json());
app.use(express.urlencoded({
  extended: true
}));
const multer = require("multer")();
const nodemailer = require("nodemailer");
const resetpass = require("./Schemas/reset");
const auth = require("./middleware/auth");
var cookieParser = require("cookie-parser");
app.use(cookieParser());

module.exports = function (router) {
  var userdatas = [];

  router.post("/Sign_up", multer.any(), async (req, res) => {
    // let   passw=  /^[A-Za-z]\w{7,14}$/;
    // let v =req.body.Password
    //   console.log(!v.match(passw));

    try {
      const oldUser = await datas.findOne({ Username: req.body.Username });
      if (
        /^\s*$/.test(req.body.Username) ||
        /^\s*$/.test(req.body.Password) ||
        /^\s*$/.test(req.body.Name) ||
        /^\s*$/.test(req.body.Confirm) ||
        /^\s*$/.test(req.body.Email)
      ) {
        res.status(403).json("Submit all the inputs!");
        console.log("Submit all the inputs!");
      } else if (req.body.Password.length < 6) {
        res.status(403).json("Passwords must contain at least six characters");
        console.log("Passwords must contain at least six characters");
        // console.log("Passwords must contain at least six characters, including uppercase, lowercase letters and numbers.");
      } else if (req.body.Password != req.body.Confirm) {
        res.status(403).json("Those passwords didn’t match. Try again.");
        console.log("Those passwords didn’t match. Try again.");
      } else if (oldUser) {
        return res.status(409).json("that Username is taken. try another");
      } else {
        const { Name, Username, Password, Confirm, Email } = req.body;
        let data = await datas(req.body);
        const encryptedPassword = await bcrypt.hash(Password, 10);
        const user = await datas.create({
          Name,
          Username,
          Email,
          Password: encryptedPassword,
        });
        const token = jwt.sign(
          { user_id: user._id, Username: user.Username },
          SECRET_KEY,
          {
            expiresIn: "2h",
          }
        );
        res.cookie("token", token, { sameSite: "none", secure: true });
        user.token = token;
        // console.log(token);
        await user.save();
        let userdata = await datas.findOne(user._id).select("-Password");
        res.status(200).json(userdata);
        // let result = data.save((err, req) => {
        //   if (err) {
        //     if (11000 === err.code || 11001 === err.code) {
        //       console.log("that Username is taken. try another");
        //       res.send("that Username is taken. try another");
        //     }
        //   } else {
        //     res.send("Account Created");
        //     console.log("Account Created");
        //     console.log(data);
        //   }
        // });
      }
    } catch (error) {
      if (error.name === "ValidationError") {
        let errors = {};

        Object.keys(error.errors).forEach((key) => {
          errors[key] = error.errors[key].message;
        });

        return res.status(400).send(errors);
      }
      console.log(error);
      res.status(500).send("Something went wrong");
    }
  });

  router.post("/Login", multer.any(), async (req, res) => {
    // localStorage.setItem('myFirstKey', 'myFirstValue')
    // console.log(localStorage.getItem('myFirstKey'))

    try {
      // Get user input
      const { Username, Password, Email } = req.body;
      var user;
      if (Email) {
        user = await datas.findOne({ Email });
      } else if (Username) {
        user = await datas.findOne({ Username });
      }
      if (user && (await bcrypt.compare(Password, user.Password))) {
        // Create token
        const token = jwt.sign(
          { user_id: user._id, Username, Email },
          SECRET_KEY,
          {
            expiresIn: "2h",
          }
        );
        // save user token
        res.cookie("token", token, { sameSite: "none", secure: true });
        // res.header('authorization', token);
        user.token = token;
        let userdata = await datas.findOne(user._id).select("-Password");
        userdatas = userdata;
        await user.save();
        // res.send(user.token);
        // res.redirect('/');
        res.status(200).json(userdata);
      } else {
        res.status(400).json("Invalid Credentials");
      }
    } catch (err) {
      console.log(err);
      res.status(400).json(err);
    }
  });

  router.delete("/AccountDelete", auth, multer.any(), async (req, res) => {
    let userdata = await datas.findOne({ Username: req.body.Username });

    if (
      /^\s*$/.test(req.body.Username) ||
      /^\s*$/.test(req.body.Password) ||
      /^\s*$/.test(req.body.Confirm)
    ) {
      res.send("Submit all the inputs!");
      console.log("Submit all the inputs!");
    } else if (userdata == undefined || userdata == null) {
      console.log("Couldn't find your account");
      res.send("Couldn't find your account");
    } else {
      if (
        userdata.Username == req.body.Username &&
        (await bcrypt.compare(req.body.Password, userdata.Password))
      ) {
        let data = await datas.deleteOne(userdata._id);
        console.log("Your account has been deleted");
        res.send("Your account has been deleted");
      } else {
        console.log("Wrong username or password");
        res.send("Wrong username or password");
      }
    }
  });

  router.put("/Passwordupdate", auth, multer.any(), async (req, res) => {
    let userdata = await datas.findOne({ Username: req.body.Username });

    if (
      /^\s*$/.test(req.body.Username) ||
      /^\s*$/.test(req.body.Password) ||
      /^\s*$/.test(req.body.Confirm)
    ) {
      res.send("Submit all the inputs!");
      console.log("Submit all the inputs!");
    } else if (userdata == undefined || userdata == null) {
      console.log("Couldn't find your account");
      res.send("Couldn't find your account");
    } else {
      if (
        userdata.Username != req.body.Username ||
        !(await bcrypt.compare(req.body.Password, userdata.Password))
      ) {
        console.log("Wrong username or password");
        res.send("Wrong username or password");
      } else if (req.body.New_Password != req.body.Confirm) {
        res.send("Those passwords didn’t match. Try again.");
        console.log("Those passwords didn’t match. Try again.");
      } else if (req.body.New_Password == req.body.Password) {
        res.send("Don't use your previous password. Try again.");
        console.log("Don't use your previous password. Try again.");
      } else if (req.body.New_Password.length < 6) {
        res.send("Passwords must contain at least six characters");
        console.log("Passwords must contain at least six characters");
        // console.log("Passwords must contain at least six characters, including uppercase, lowercase letters and numbers.");
      } else {
        const encryptedPassword = await bcrypt.hash(req.body.New_Password, 10);
        req.body.Password = encryptedPassword;
        let data = await datas.updateOne(
          { _id: userdata._id },
          { $set: req.body }
        );
        console.log("Your password has been reset successfully");
        res.send("Your password has been reset successfully");
      }
    }
  });

 

  router.get("/Logout", auth, async (req, res) => {
    res.clearCookie("token");
    res.send("Done");
  });
  router.get("/Home", auth, async (req, res) => {
    // console.log(userdatas)
    const userId =req.decoded.user_id
    const oldUser = await datas.findById(userId).select("-Password");
    console.log(oldUser);
    res.status(200).json(oldUser);
    
  });

  router.get("/Services", auth, async (req, res) => {
    res.status(200).json(userdatas);
  });
  router.get("/HTML", auth, async (req, res) => {
    res.status(200).json(userdatas);
  });
  router.get("/CSS", auth, async (req, res) => {
    res.status(200).json(userdatas);
  });
  router.get("/JavaScript", auth, async (req, res) => {
    res.status(200).json(userdatas);
  });
  router.get("/Contact", async (req, res) => {
    res.status(200).json(userdatas);
  });
  router.get("/profile", auth, async (req, res) => {
    res.status(200).json(userdatas);
  });
  // let cookie=req.cookies.token
  // res.setHeader('authorization',cookie );
  // let data = await datas.find();
  return router;
};
