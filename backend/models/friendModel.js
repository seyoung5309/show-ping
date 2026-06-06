const pool = require("../db");

// 친구 목록 조회
const findAllFriends = async (userId, search = "") => {
  const [rows] = await pool.query(
    `SELECT u.id, p.nickname, p.image, p.comment
     FROM friends f
     JOIN users u ON u.id = f.friend_id
     JOIN profile p ON p.user_id = u.id
     WHERE f.user_id = ?
     AND p.nickname LIKE ?`,
    [userId, `%${search}%`],
  );
  return rows;
};

// 받은 친구 요청 목록
const findFriendRequests = async (userId) => {
  const [rows] = await pool.query(
    `SELECT fr.id, u.id as user_id, p.nickname, p.image, p.comment
     FROM friends_request fr
     JOIN users u ON u.id = fr.user_id
     JOIN profile p ON p.user_id = u.id
     WHERE fr.friend_id = ? AND fr.state = '대기중'`,
    [userId],
  );
  return rows;
};

// 사용자 검색
const searchUsers = async (userId, search) => {
  const [rows] = await pool.query(
    `SELECT u.id, p.nickname, p.image, p.comment,
      CASE
        WHEN f.id IS NOT NULL THEN 'friend'
        WHEN fr.id IS NOT NULL THEN 'requested'
        ELSE 'none'
      END as status
     FROM users u
     JOIN profile p ON p.user_id = u.id
     LEFT JOIN friends f ON f.user_id = ? AND f.friend_id = u.id
     LEFT JOIN friends_request fr ON fr.user_id = ? AND fr.friend_id = u.id AND fr.state = '대기중'
     WHERE p.nickname LIKE ? AND u.id != ?`,
    [userId, userId, `%${search}%`, userId],
  );
  return rows;
};

// 친구 요청 보내기
const createFriendRequest = async (userId, friendId) => {
  const [result] = await pool.query(
    "INSERT INTO friends_request (user_id, friend_id) VALUES (?, ?)",
    [userId, friendId],
  );
  return result.insertId;
};

// 이미 요청했는지 확인
const findFriendRequest = async (userId, friendId) => {
  const [rows] = await pool.query(
    "SELECT * FROM friends_request WHERE user_id = ? AND friend_id = ?",
    [userId, friendId],
  );
  return rows[0];
};

// 이미 친구인지 확인
const findFriend = async (userId, friendId) => {
  const [rows] = await pool.query(
    "SELECT * FROM friends WHERE user_id = ? AND friend_id = ?",
    [userId, friendId],
  );
  return rows[0];
};

// 친구 요청 상태 변경
const updateFriendRequest = async (requestId, state) => {
  await pool.query("UPDATE friends_request SET state = ? WHERE id = ?", [
    state,
    requestId,
  ]);
};

// 친구 추가 (양방향)
const addFriend = async (userId, friendId) => {
  await pool.query(
    "INSERT INTO friends (user_id, friend_id) VALUES (?, ?), (?, ?)",
    [userId, friendId, friendId, userId],
  );
};

// 친구 삭제 (양방향)
const deleteFriend = async (userId, friendId) => {
  await pool.query(
    "DELETE FROM friends WHERE (user_id = ? AND friend_id = ?) OR (user_id = ? AND friend_id = ?)",
    [userId, friendId, friendId, userId],
  );
};

// 친구 수 조회
const countFriends = async (userId) => {
  const [rows] = await pool.query(
    "SELECT COUNT(*) as count FROM friends WHERE user_id = ?",
    [userId],
  );
  return rows[0].count;
};

module.exports = {
  findAllFriends,
  findFriendRequests,
  searchUsers,
  createFriendRequest,
  findFriendRequest,
  findFriend,
  updateFriendRequest,
  addFriend,
  deleteFriend,
  countFriends,
};
