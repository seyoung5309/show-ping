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
} = require("../controllers/friendController");

router.get("/", auth, getFriends);
router.get("/search", auth, searchUsers);
router.get("/requests", auth, getFriendRequests);
router.post("/request/:id", auth, sendFriendRequest);
router.patch("/request/:id", auth, handleFriendRequest);
router.delete("/:id", auth, deleteFriend);

module.exports = router;
