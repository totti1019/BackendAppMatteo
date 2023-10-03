import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

import usersRouters from "./routers/users.js";
import authRoutes from "./routers/auth.js";

import { authenticateToken } from "./middlewares/auth.js";

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use("/users", authenticateToken, usersRouters);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.send("Benvenuto nella homepage");
});

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server listening on ${PORT}`); // npm run dev
    });
  })
  .catch((error) => console.error(error));
