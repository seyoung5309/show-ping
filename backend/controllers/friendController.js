const {
  findAllFriends,
  findFriendRequests,
  searchUsers,
  createFriendRequest,
  findFriendRequest,
  findFriend,
  updateFriendRequest,
  addFriend,
  deleteFriend,
  deleteFriendRequest,
  countFriends,
} = require("../models/friendModel");

// 친구 목록 조회
const getFriends = async (req, res) => {
  const { search } = req.query;
  const friends = await findAllFriends(req.user.id, search);
  res.status(200).json(friends);
};

// 받은 친구 요청 목록
const getFriendRequests = async (req, res) => {
  const requests = await findFriendRequests(req.user.id);
  res.status(200).json(requests);
};

// 사용자 검색
const searchUsersController = async (req, res) => {
  const { q } = req.query;
  if (!q) return res.status(400).json({ message: "검색어를 입력해주세요." });
  const users = await searchUsers(req.user.id, q);
  res.status(200).json(users);
};

// 친구 요청 보내기
const sendFriendRequest = async (req, res) => {
  const friendId = req.params.id;

  const alreadyFriend = await findFriend(req.user.id, friendId);
  if (alreadyFriend)
    return res.status(409).json({ message: "이미 친구입니다." });

  const alreadyRequested = await findFriendRequest(req.user.id, friendId);
  if (alreadyRequested)
    return res.status(409).json({ message: "이미 요청을 보냈습니다." });

  await createFriendRequest(req.user.id, friendId);
  res.status(201).json({ message: "친구 요청을 보냈습니다." });
};

// 친구 요청 승인/거절
const handleFriendRequest = async (req, res) => {
  const { action } = req.body;
  const requestId = req.params.id;

  if (action === "승인") {
    const [rows] = await require("../db").query(
      "SELECT * FROM friends_request WHERE id = ?",
      [requestId],
    );
    const request = rows[0];
    if (!request)
      return res.status(404).json({ message: "요청을 찾을 수 없습니다." });
    await addFriend(request.user_id, request.friend_id);
    await deleteFriendRequest(requestId);
    return res.status(200).json({ message: "친구 요청을 승인했습니다." });
  }

  if (action === "거절") {
    await deleteFriendRequest(requestId);
    return res.status(200).json({ message: "친구 요청을 거절했습니다." });
  }

  res
    .status(400)
    .json({ message: "올바른 action을 입력해주세요. (승인/거절)" });
};

// 친구 삭제
const deleteFriendController = async (req, res) => {
  await deleteFriend(req.user.id, req.params.id);
  res.status(200).json({ message: "친구가 삭제되었습니다." });
};

const getFriendCount = async (req, res) => {
  const count = await countFriends(req.user.id);
  res.status(200).json({ count });
};

module.exports = {
  getFriends,
  getFriendRequests,
  searchUsers: searchUsersController,
  sendFriendRequest,
  handleFriendRequest,
  deleteFriend: deleteFriendController,
  getFriendCount,
};
