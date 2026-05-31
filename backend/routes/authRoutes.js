const express = require("express");
const router = express.Router();

const {
  checkNickname,
  signup,
  login,
} = require("../controllers/authController");

router.post("/check-nickname", checkNickname);
router.post("/signup", signup);
router.post("/login", login);

module.exports = router;
