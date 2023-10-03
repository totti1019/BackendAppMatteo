import { mongoose } from "mongoose";
import { User } from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const JWT_SECRET =
  "cdgyskCBKS369321T4RBFTCG6WMDFCDBJZAOQEJKQEJKQEJKFBvfegywuof98";

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user)
    return res
      .status(404)
      .json({ code: res.statusCode, message: "Utente/password errata" });

  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user._id, username: user.email }, JWT_SECRET);
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
};
