const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  togglePublic,
  addPingToGroup,
  removePingFromGroup,
  getPingsInGroup,
  getGroup,
} = require("../controllers/groupController");

router.get("/", auth, getGroups);
router.post("/", auth, createGroup);
router.get("/:id/pings", auth, getPingsInGroup);
router.post("/:id/pings", auth, addPingToGroup);
router.delete("/:id/pings/:pingId", auth, removePingFromGroup);
router.get("/:id", auth, getGroup);
router.put("/:id", auth, updateGroup);
router.delete("/:id", auth, deleteGroup);
router.patch("/:id/public", auth, togglePublic);
module.exports = router;
