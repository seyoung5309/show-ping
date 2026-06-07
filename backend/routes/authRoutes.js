const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");

const {
  checkNickname,
  signup,
  login,
  withdraw,
} = require("../controllers/authController");

router.post("/check-nickname", checkNickname);
router.post("/signup", signup);
router.post("/login", login);
router.delete("/withdraw", auth, withdraw);

module.exports = router;
