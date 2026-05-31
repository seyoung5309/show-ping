const express = require("express");
const router = express.Router();
const { checkNickname, signup } = require("../controllers/authController");

router.post("/check-nickname", checkNickname);
router.post("/signup", signup);

module.exports = router;
