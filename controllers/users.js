import { mongoose } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { User } from "../models/user.js";

let users = [];

export const getAllUser = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);
  } catch (error) {
    res.status(404).json({ code: res.statusCode, message: error.message });
  }
};

export const insertUser = async (req, res) => {
  const user = req.body;

  const newUser = new User(user);

  try {
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(409).json({ code: res.statusCode, message: error.message });
  }
};

export const getUserByID = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "id non conforme con mongo" });
  try {
    const user = await User.findById(id);

    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ code: res.statusCode, message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "id non conforme con mongo" });

  try {
    await User.findByIdAndDelete(id);
    res.status(200).json({ message: "utente eliminato con successo" });
  } catch (error) {
    res.status(404).json({ code: res.statusCode, message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { id } = req.params;
  const data = { ...req.body };

  if (!mongoose.Types.ObjectId.isValid(id))
    return res.status(404).json({ message: "id non conforme con mongo" });

  try {
    const user = await User.findByIdAndUpdate(id, data, { new: true });
    res.status(200).json(user);
  } catch (error) {
    res.status(404).json({ code: res.statusCode, message: error.message });
  }
};
