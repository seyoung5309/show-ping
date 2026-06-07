const pool = require("../db");

// 전체 조회
const findAllGroups = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM ping_groups WHERE user_id = ? ORDER BY created_at ASC",
    [userId],
  );
  return rows;
};

// 단일 조회
const findGroupById = async (id, userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM ping_groups WHERE id = ? AND user_id = ?",
    [id, userId],
  );
  return rows[0];
};

// 생성
const createGroup = async (userId, name, image) => {
  const [result] = await pool.query(
    "INSERT INTO ping_groups (user_id, name, image) VALUES (?, ?, ?)",
    [userId, name, image],
  );
  return result.insertId;
};

// 수정
const updateGroup = async (id, userId, name, image) => {
  await pool.query(
    "UPDATE ping_groups SET name = ?, image = ? WHERE id = ? AND user_id = ?",
    [name, image, id, userId],
  );
};

// 삭제
const deleteGroup = async (id, userId) => {
  await pool.query("DELETE FROM ping_groups WHERE id = ? AND user_id = ?", [
    id,
    userId,
  ]);
};

// 공개/비공개 토글
const togglePublic = async (id, userId) => {
  await pool.query(
    "UPDATE ping_groups SET is_public = NOT is_public WHERE id = ? AND user_id = ?",
    [id, userId],
  );
};

// 그룹에 상품 추가
const addPingToGroup = async (groupId, pingId) => {
  await pool.query(
    "INSERT INTO group_with_ping (group_id, ping_id) VALUES (?, ?)",
    [groupId, pingId],
  );
};

// 그룹에서 상품 제거
const removePingFromGroup = async (groupId, pingId) => {
  await pool.query(
    "DELETE FROM group_with_ping WHERE group_id = ? AND ping_id = ?",
    [groupId, pingId],
  );
};

// 그룹 내 상품 목록
const findPingsInGroup = async (groupId) => {
  const [rows] = await pool.query(
    `SELECT p.* FROM pings p
     JOIN group_with_ping gwp ON gwp.ping_id = p.id
     WHERE gwp.group_id = ?
     ORDER BY ping_id DESC`,
    [groupId],
  );
  return rows;
};

const getLatestPingImage = async (groupId) => {
  const [rows] = await pool.query(
    `SELECT p.image FROM pings p
     JOIN group_with_ping gwp ON gwp.ping_id = p.id
     WHERE gwp.group_id = ? AND p.image IS NOT NULL
     ORDER BY p.created_at DESC LIMIT 1`,
    [groupId],
  );
  return rows[0] ? rows[0].image : null;
};

module.exports = {
  findAllGroups,
  findGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  togglePublic,
  addPingToGroup,
  removePingFromGroup,
  findPingsInGroup,
  getLatestPingImage,
};
