import { mongoose } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

//Require express router, passport, passport-google-oauth20, passport-facebook
const router = require("express").Router();
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const FacebookStrategy = require("passport-facebook").Strategy;

//Require User Model
const User = require("../models/User");

//Use passport-local configuration Create passport local Strategy
passport.use(User.createStrategy());

//Serialize and deserialize are only necessary when using session
passport.serializeUser(function (user, done) {
  done(null, user.id);
});
passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

//Configure Google Strategy
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:3000/auth/google/secret",
    },
    function (accessToken, refreshToken, profile, cb) {
      // console.log(profile)
      User.findOrCreate({ googleId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

//Configure FacebookStrategy
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FB_APP_ID,
      clientSecret: process.env.FB_APP_SECRET,
      callbackURL: "http://localhost:3000/auth/facebook/secret",
    },
    function (accessToken, refreshToken, profile, cb) {
      // console.log(profile)
      User.findOrCreate({ facebookId: profile.id }, function (err, user) {
        return cb(err, user);
      });
    }
  )
);

//Google auth route
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile"] })
);
router.get(
  "/auth/google/secret",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect secrets page.
    res.redirect("/secrets");
  }
);

//Facebook auth route
router.get("/auth/facebook", passport.authenticate("facebook"));
router.get(
  "/auth/facebook/secret",
  passport.authenticate("facebook", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect secrets page.
    res.redirect("/secrets");
  }
);

//Local route Register new user
router.post("/auth/register", async (req, res) => {
  try {
    //Register User
    const registerUser = await User.register(
      { username: req.body.username },
      req.body.password
    );
    if (registerUser) {
      // if user registered, we will authenticate the user using passport
      passport.authenticate("local")(req, res, function () {
        res.redirect("/secrets");
      });
    } else {
      res.redirect("/register");
    }
  } catch (err) {
    console.log(err);
    res.send("Error: " + err.message);
  }
});

//Local route Login user
router.post("/auth/login", (req, res) => {
  //create new user
  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });
  //use passport login method to check if user credentials true and  authenticate it
  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        res.redirect("/secrets");
      });
    }
  });
});

//Logout user
router.get("/auth/logout", (req, res) => {
  //use passport logout method to end user session and unauthenticate it
  req.logout();
  res.redirect("/");
});

//Export router
module.exports = router;

/*export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res
      .status(404)
      .json({ code: res.statusCode, message: "Utente/password errata" });

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, username: user.email },
      process.env.JWT_SECRET
    );
    return res.status(200).json({ code: res.statusCode, data: token });
  }

  return res
    .status(401)
    .json({ code: res.statusCode, message: "Utente/password errata" });
};

export const register = async (req, res) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string") {
    return res
      .status(404)
      .json({ code: res.statusCode, message: "Email non valida" });
  }

  if (!password || typeof password !== "string") {
    return res
      .status(404)
      .json({ code: res.statusCode, message: "Password non valida" });
  }

  const passwordHashed = await bcrypt.hash(password, 10);

  const user = new User({
    email: email,
    password: passwordHashed,
  });
  try {
    await user.save();
    res.status(201).json({
      code: res.statusCode,
      message: "Registrato con successo",
    });
  } catch (error) {
    res.status(409).json({ code: res.statusCode, message: error.message });
  }
}; */
