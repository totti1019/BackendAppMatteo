const express = require("express");
const { register, loginGoogle, login } = require("../controllers/auth");

const router = express.Router();

router.post("/register", register);
router.post("/loginGoogle", loginGoogle);
router.post("/login", login);

module.exports = router;
