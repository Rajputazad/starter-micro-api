const nodemailer = require("nodemailer");
const datas = require("./Schemas/reset");
var logindb = require("./Schemas/login");
const multer = require("multer")();
const express = require("express");
const app = express();
app.use(express.json());
app.use(
  express.urlencoded({
    extended: true,
  })
);

module.exports = function (router) {
  router.post("/otp", multer.any(), async (req, res) => {
    try {
     var Email = req.body.Email;
      if (!Email) {
        res.status(400).send("Email required");
      } else {
        let user = await logindb.findOne({ Email });
        if (!user) {
          res.status(400).json("Couldn't find your account");
        } else {
          let email = await datas.findOne({ Email });
          if (email) {
            var del = await datas.deleteOne(email);
          }
          const otp = Math.floor(100000 + Math.random() * 900000);
          var transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
              user: process.env.EMAIL,
              pass: process.env.PASSWORD,
            },
          });

          var mailOptions = {
            from: process.env.EMAIL,
            to: Email,
            subject: "Reset password",
            html: `<h3>Your otp ${otp} for Reset password</h3>`,
          };
          // "singhbhi337@gmail.com"
          transporter.sendMail(mailOptions, async function (error, info) {
            if (error) {
              console.log(error);
              res.send(error);
            } else {
              const reset = {
                Otp: otp,
                Email: Email,
              };
              var result = await datas(reset);
              result = await result.save();
              console.log("Email sent: " + info.response);
              // res.status(200).json("Email sent: " + info.response);
              res.status(200).json("Otp send successfully");
            }
          });
        }
      }
    } catch (err) {
      res.status(500).send("Something went wrong");
      console.log(err);
    }
  });

  router.post("/VerifyOtp", multer.any(), async (req, res) => {
    try {
    var  otp = req.body.Otp;
      var verify = await datas.findOne({ otp });
      if (!verify) {
        res.status(400).json("Incorrect verification code provided.");
      } else if (otp.length < 6) {
        res.status(400).json("Please enter six digit code");
      } else {
        if (verify.Otp == otp) {
          res.status(200).json("Otp verified successfully");
          var del = await datas.deleteOne({ Otp: verify.Otp });
        } else {
          res.status(400).json("Incorrect verification code provided.");
        }
      }
    } catch (error) {
      res.status(500).send("Something went wrong");
      console.log(error);
    }
  });

  return router;
};
