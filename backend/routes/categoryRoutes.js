const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const { getCategories } = require("../controllers/categoryController");

router.get("/", auth, getCategories);

module.exports = router;
