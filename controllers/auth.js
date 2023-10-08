const mongoose = require("mongoose");

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
      .json({ code: res.statusCode, message: "Email non valida" });
  }

  if (!id || typeof id !== "string") {
    return res
      .status(404)
      .json({ code: res.statusCode, message: "Password non valida" });
  }

  if (!fullName || typeof fullName !== "string") {
    return res
      .status(404)
      .json({ code: res.statusCode, message: "Nominativo mancante" });
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
  const { email, password, fullName } = req.body;

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

  if (!fullName || typeof fullName !== "string") {
    return res
      .status(404)
      .json({ code: res.statusCode, message: "Nominativo mancante" });
  }

  const user = await User.findOne({ email });
  if (!user) {
    const passwordHashed = await bcrypt.hash(password, 10);

    const user = new User({
      fullName: fullName,
      email: email,
      password: passwordHashed,
    });
    await user.save();

    if (await bcrypt.compare(password, user.id)) {
      const token = jwt.sign(
        { id: user._id, username: user.email },
        process.env.JWT_SECRET
      );
      return res.status(200).json({ code: res.statusCode, jwt: token });
    }
  }
  if (await bcrypt.compare(id, user.id)) {
    const token = jwt.sign(
      { id: user._id, username: user.email },
      process.env.JWT_SECRET
    );
    return res.status(200).json({ code: res.statusCode, jwt: token });
  }
};

// METODO PER LA REGISTRAZIONE
const register = async (req, res) => {
  const { email, password, fullName } = req.body;

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

  if (!fullName || typeof fullName !== "string") {
    return res
      .status(404)
      .json({ code: res.statusCode, message: "Nominativo mancante" });
  }

  const passwordHashed = await bcrypt.hash(password, 10);

  const user = new User({
    fullName: fullName,
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
};

module.exports = {
  login,
  loginGoogle,
  register,
};
