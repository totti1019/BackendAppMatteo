import express from "express";
import {
  getAllUser,
  insertUser,
  getUserByID,
  deleteUser,
  updateUser,
} from "../controllers/users.js";

const router = express.Router();

router.get("/", getAllUser);
router.post("/", insertUser);
router.get("/:id", getUserByID);
router.delete("/:id", deleteUser);
router.patch("/:id", updateUser);

export default router;
