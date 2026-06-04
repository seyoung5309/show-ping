const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");
const {
  getProfile,
  updateProfile,
  uploadProfileImage,
  getPublicPings,
  getPublicGroups,
} = require("../controllers/profileController");

router.get("/", auth, getProfile);
router.put("/", auth, updateProfile);
router.post("/image", auth, upload.single("image"), uploadProfileImage);
router.get("/pings", auth, getPublicPings);
router.get("/groups", auth, getPublicGroups);

module.exports = router;
