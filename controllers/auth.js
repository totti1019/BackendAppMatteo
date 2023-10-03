import { mongoose } from "mongoose";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client();

export const login = async (req, res) => {
  const { email, id } = req.body;

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

  verifyGoogleToken(req, res, email, id);
};

async function verifyGoogleToken(req, res, email, id) {
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
      email: email,
      id: passwordHashed,
    });
    try {
      await user.save();

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
  try {
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

  return res
    .status(401)
    .json({ code: res.statusCode, message: "Utente/password errata" });
}

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
};
