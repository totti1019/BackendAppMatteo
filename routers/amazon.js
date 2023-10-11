const express = require("express");
const { searchAmazon } = require("../controllers/amazon");

const router = express.Router();

router.post("/searchAmazon", searchAmazon);

module.exports = router;
