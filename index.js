require("dotenv").config();
require("./config");
var morgan = require("morgan");
const express = require("express");
const app = express();
const port = 3000;
const router = express.Router();
const login = require("./Login")(router);
require("./Contact")(router);
require("./Profile")(router);
require("./PasswordReset")(router);
require("./Webpages")(router);
app.use(express.json());
const cors = require("cors");
app.use(
  cors({
    origin: ["technotechinfo.epizy.com"],
    credentials: true,
  })
);
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "technotechinfo.epizy.com");
  res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id,authorization");

  next();
});

const auth = require("./middleware/auth");
  var cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(morgan("dev"));

app.use("/", login);

app.listen(port, () => {
  console.log(`Port = ${port} URL:-http://localhost:${port}/`);
});
