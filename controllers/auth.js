const mongoose = require("mongoose");
const localizable = require("../locales/localizables");
const validator = require("validator");

const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const { OAuth2Client } = require("google-auth-library");

const client = new OAuth2Client();

// METODO PER IL LOGIN DI GOOGLE
const loginGoogle = async (req, res) => {
  const { email, id, fullName } = req.body;

  if (!email || typeof email !== "string") {
    return res
      .status(404)
      .json({ code: res.statusCode, message: localizable.emailNonValida });
  }

  if (!id || typeof id !== "string") {
    return res.status(404).json({
      code: res.statusCode,
      message: localizable.passwordNonValida,
    });
  }

  if (!fullName || typeof fullName !== "string") {
    return res.status(404).json({
      code: res.statusCode,
      message: localizable.nominativoMancante,
    });
  }

  verifyGoogleToken(req, res, email, id, fullName);
};

async function verifyGoogleToken(req, res, email, id, fullName) {
  try {
    const ticket = await client.verifyIdToken({
      idToken: id,
      audience: process.env.CLIENT_ID_GOOGLE,
    });
    const payload = ticket.getPayload();
    const userid = payload["sub"];

    const user = await User.findOne({ email });
    if (!user) {
      const passwordHashed = await bcrypt.hash(userid, 10);

      const user = new User({
        fullName: fullName,
        email: email,
        id: passwordHashed,
      });
      await user.save();

      if (await bcrypt.compare(userid, user.id)) {
        const token = jwt.sign(
          { id: user._id, username: user.email },
          process.env.JWT_SECRET
        );
        return res.status(200).json({ code: res.statusCode, jwt: token });
      }
    }
    if (await bcrypt.compare(userid, user.id)) {
      const token = jwt.sign(
        { id: user._id, username: user.email },
        process.env.JWT_SECRET
      );
      return res.status(200).json({ code: res.statusCode, jwt: token });
    }
  } catch (error) {
    return res
      .status(409)
      .json({ code: res.statusCode, message: error.message });
  }
}

// METODO PER IL LOGIN CON EMAIL E PASSWORD
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || typeof email !== "string") {
    return res
      .status(404)
      .json({ code: res.statusCode, message: localizable.emailNonValida });
  }

  if (!password || typeof password !== "string") {
    return res.status(404).json({
      code: res.statusCode,
      message: localizable.passwordNonValida,
    });
  }

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({
      code: res.statusCode,
      message: localizable.utenteNonRegistrato,
    });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign(
      { id: user._id, username: user.email },
      process.env.JWT_SECRET
    );
    return res.status(200).json({ code: res.statusCode, jwt: token });
  }
  return res.status(404).json({
    code: res.statusCode,
    message: localizable.emailPasswordErrata,
  });
};

// METODO PER LA REGISTRAZIONE
const register = async (req, res) => {
  const { email, password, fullName } = req.body;

  // Sanifica i campi uno per uno
  const sanitizedEmail = validator.escape(email);
  const sanitizedFullName = validator.escape(fullName);

  if (!sanitizedEmail || typeof sanitizedEmail !== "string") {
    return res
      .status(404)
      .json({ code: res.statusCode, message: localizable.emailNonValida });
  }

  // La password non deve essere sanificata tanto viene hashata
  if (!password || typeof password !== "string") {
    return res.status(404).json({
      code: res.statusCode,
      message: localizable.passwordNonValida,
    });
  }

  if (!sanitizedFullName || typeof sanitizedFullName !== "string") {
    return res.status(404).json({
      code: res.statusCode,
      message: localizable.nominativoMancante,
    });
  }

  const userFind = await User.findOne({ sanitizedEmail });

  if (userFind) {
    return res.status(409).json({
      code: res.statusCode,
      message: localizable.utenteRegistratoEffettuaLogin,
    });
  }
  const passwordHashed = await bcrypt.hash(password, 10);

  const user = new User({
    fullName: sanitizedFullName,
    email: sanitizedEmail,
    password: passwordHashed,
  });
  try {
    await user.save();
    return res.status(201).json({
      code: res.statusCode,
      message: localizable.registratoConSuccesso,
    });
  } catch (error) {
    let errorMessage = error.message;
    if (
      error.name === "ValidationError" &&
      error.errors &&
      error.errors.email
    ) {
      errorMessage = error.errors.email.message;
    }
    return res
      .status(409)
      .json({ code: res.statusCode, message: errorMessage });
  }
};

module.exports = {
  login,
  loginGoogle,
  register,
};
