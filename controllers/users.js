import { v4 as uuidv4 } from "uuid";
import { User } from "../models/user.js";

let users = [];

export const getAllUser = (req, res) => {
  res.send(users);
};

export const insertUser = async (req, res) => {
  const user = req.body;

  const newUser = new User(user);

  try {
    await newUser.save();

    res.status(201).json(newUser);
  } catch (error) {
    res.status(409).json({ message: error.message });
  }
};

export const getUserByID = (req, res) => {
  const { id } = req.params;
  const userTrovato = users.find((user) => user.id === id);
  const response = userTrovato == null ? [] : userTrovato;
  res.send(response);
};

export const deleteUser = (req, res) => {
  const { id } = req.params;
  users = users.filter((user) => user.id != id);
  res.send(`Utente con id ${id} è stato eliminato con successo`);
};

export const updateUser = (req, res) => {
  const { id } = req.params;
  const { nome, cognome, email } = req.body;

  const userTrovato = users.find((user) => user.id === id);
  if (nome) userTrovato.nome = nome;
  if (cognome) userTrovato.cognome = cognome;
  if (email) userTrovato.email = email;

  res.send(`Utente con id ${id} è stato modificato con successo`);
};
