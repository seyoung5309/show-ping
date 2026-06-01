const pool = require("../db");

// 전체 목록 조회
const findAllPings = async (userId, search, categoryId) => {
  let query = `
    SELECT DISTINCT p.* FROM pings p
  `;
  const params = [userId];

  if (categoryId) {
    query += `JOIN category_with_ping cwp ON cwp.ping_id = p.id `;
  }

  query += `WHERE p.user_id = ? `;

  if (search) {
    query += `AND p.name LIKE ? `;
    params.push(`%${search}%`);
  }

  if (categoryId) {
    query += `AND cwp.category_id = ? `;
    params.push(categoryId);
  }

  query += `ORDER BY p.created_at DESC`;

  const [rows] = await pool.query(query, params);
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
