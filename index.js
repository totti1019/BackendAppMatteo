const express = require("express");

const mongoose = require("mongoose");

const dotenv = require("dotenv");

const usersRouters = require("./routers/users");

const authRoutes = require("./routers/auth");

const { authenticateToken } = require("./middlewares/auth");

const amazonRoutes = require("./routers/amazon");

const app = express();
dotenv.config();
const PORT = process.env.PORT || 3000;

app.use(express.json());

app.use("/users", authenticateToken, usersRouters);
app.use("/auth", authRoutes);
app.use("/amazon", authenticateToken, amazonRoutes);

app.get("/", (req, res) => {
  res.send("Benvenuto nella homepage di Pricer");
});

mongoose
  .connect(process.env.CONNECTION_URL)
  .then(() => {
    app.listen(PORT, () => {
      console.log(`server listening on ${PORT}`); // npm run dev
    });
  })
  .catch((error) => console.error(error));
