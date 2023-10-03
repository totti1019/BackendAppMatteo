import express from "express";
import mongoose from "mongoose";
import cors from "cors";

import usersRouters from "./routers/users.js";
import usersAuth from "./routers/auth.js";

const app = express();
const PORT = process.env.PORT || 3000;
const CONNECCTION_URL = "mongodb://0.0.0.0:27017/pricer";

app.use(express.json());
app.use("/users", usersRouters);
app.use("/auth", usersAuth);

app.get("/", (req, res) => {
  res.send("Benvenuto nella homepage");
});

mongoose
  .connect(CONNECCTION_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server listening on ${PORT}`); // npm run dev
    });
  })
  .catch((error) => console.error(error));
