import express from "express";
import { v4 as uuidv4 } from "uuid";

const router = express.Router();

let users = [];

router.get("/", (req, res) => {
  res.send(users);
});

router.post("/", (req, res) => {
  const user = req.body;
  const id = uuidv4();
  const userWithID = { ...user, id: id };
  users.push(userWithID);
  res.send(`Utente con email ${user.email} è stato aggiunto con successo`);
});

router.get("/:id", (req, res) => {
  const { id } = req.params;
  const userTrovato = users.find((user) => user.id === id);
  const response = userTrovato == null ? [] : userTrovato;
  res.send(response);
});

router.delete("/:id", (req, res) => {
  const { id } = req.params;
  users = users.filter((user) => user.id != id);
  res.send(`Utente con id ${id} è stato eliminato con successo`);
});

router.patch("/:id", (req, res) => {
  const { id } = req.params;
  const { nome, cognome, email } = req.body;

  const userTrovato = users.find((user) => user.id === id);
  if (nome) userTrovato.nome = nome;
  if (cognome) userTrovato.cognome = cognome;
  if (email) userTrovato.email = email;

  res.send(`Utente con id ${id} è stato modificato con successo`);
});

export default router;
