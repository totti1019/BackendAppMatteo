import express from "express";
import usersRouters from "./routers/users.js";

const app = express();
const PORT = 3000;

app.use(express.json());
app.use("/users", usersRouters);

app.get("/", (req, res) => {
  res.send("Benvenuto nella homepage");
});

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`); // npm run dev
});
