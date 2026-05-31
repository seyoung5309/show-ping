const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  addProperty,
  deleteUnusedProperties,
} = require("../controllers/propertyController");

router.post("/", auth, addProperty); // 속성 추가
router.delete("/cleanup", auth, deleteUnusedProperties); // 미사용 속성 삭제

module.exports = router;
