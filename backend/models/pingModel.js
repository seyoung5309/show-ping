const pool = require("../db");

// 전체 목록 조회
const findAllPings = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM pings WHERE user_id = ? ORDER BY created_at DESC",
    [userId],
  );
  return rows;
};

// 상세 조회
const findPingById = async (id, userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM pings WHERE id = ? AND user_id = ?",
    [id, userId],
  );
  return rows[0];
};

// 추가
const createPing = async (userId, image, name, price, comment) => {
  const [result] = await pool.query(
    "INSERT INTO pings (user_id, image, name, price, comment) VALUES (?, ?, ?, ?, ?)",
    [userId, image, name, price, comment],
  );
  return result.insertId;
};

// 수정
const updatePing = async (id, userId, image, name, price, comment) => {
  await pool.query(
    "UPDATE pings SET image = ?, name = ?, price = ?, comment = ? WHERE id = ? AND user_id = ?",
    [image, name, price, comment, id, userId],
  );
};

// 삭제
const deletePing = async (id, userId) => {
  await pool.query("DELETE FROM pings WHERE id = ? AND user_id = ?", [
    id,
    userId,
  ]);
};

// 공개/비공개 토글
const togglePublic = async (id, userId) => {
  await pool.query(
    "UPDATE pings SET is_public = NOT is_public WHERE id = ? AND user_id = ?",
    [id, userId],
  );
};

module.exports = {
  findAllPings,
  findPingById,
  createPing,
  updatePing,
  deletePing,
  togglePublic,
};
