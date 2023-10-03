//Require necessary packages
const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const ejs = require("ejs");
const session = require("express-session");
const passport = require("passport");

//import usersRouters from "./routers/users.js";
//import authRoutes from "./routers/auth.js";

//Require Routes
const authRoute = require("./routers/auth");
const secretRoute = require("./routers/secrets");

const authenticateToken = require("./middlewares/auth");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

//Setup view engine EJS, use body-parser and express static
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Setup session
app.use(
  session({
    secret: process.env.SECRET_SESSION,
    resave: false,
    saveUninitialized: false,
  })
);

//Initialize passport
app.use(passport.initialize());

//Use passport to deal with session
app.use(passport.session());

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server listening on ${PORT}`); // npm run dev
    });
  })
  .catch((error) => console.error(error));

app.use(express.json());
app.use("/auth", authRoute);
//app.use("/users", authenticateToken, usersRouters);

app.get("/", (req, res) => {
  res.send("Benvenuto nella homepage");
});
