const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const upload = require("../middleware/upload");

const {
  getPings,
  getPing,
  createPing,
  updatePing,
  deletePing,
  togglePublic,
} = require("../controllers/pingController");

router.get("/", auth, getPings);
router.get("/:id", auth, getPing);
router.post("/", auth, upload.single("image"), createPing);
router.put("/:id", auth, upload.single("image"), updatePing);
router.delete("/:id", auth, deletePing);
router.patch("/:id/public", auth, togglePublic);

module.exports = router;
