const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getFriends,
  getFriendRequests,
  searchUsers,
  sendFriendRequest,
  handleFriendRequest,
  deleteFriend,
  getFriendCount,
} = require("../controllers/friendController");

const { getUserProfile } = require("../controllers/profileController");

router.get("/", auth, getFriends);
router.get("/search", auth, searchUsers);
router.get("/count", auth, getFriendCount);
router.get("/requests", auth, getFriendRequests);
router.post("/request/:id", auth, sendFriendRequest);
router.patch("/request/:id", auth, handleFriendRequest);
router.delete("/:id", auth, deleteFriend);
router.get("/:userId", auth, getUserProfile);

module.exports = router;
