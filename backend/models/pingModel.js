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
const createPing = async (userId, image, name, price, comment, link) => {
  const [result] = await pool.query(
    "INSERT INTO pings (user_id, image, name, price, comment, link) VALUES (?, ?, ?, ?, ?, ?)",
    [userId, image, name, price, comment, link],
  );
  return result.insertId;
};

// 수정
const updatePing = async (id, userId, image, name, price, comment, link) => {
  await pool.query(
    "UPDATE pings SET image = ?, name = ?, price = ?, comment = ?, link = ? WHERE id = ? AND user_id = ?",
    [image, name, price, comment, link, id, userId],
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

const addCategoryToPing = async (pingId, categoryId) => {
  await pool.query(
    "INSERT INTO category_with_ping (ping_id, category_id) VALUES (?, ?)",
    [pingId, categoryId],
  );
};

const deleteCategoryFromPing = async (pingId) => {
  await pool.query("DELETE FROM category_with_ping WHERE ping_id = ?", [
    pingId,
  ]);
};

const findCategoryByPingId = async (pingId) => {
  const [rows] = await pool.query(
    "SELECT category_id FROM category_with_ping WHERE ping_id = ?",
    [pingId],
  );
  return rows[0];
};

module.exports = {
  findAllPings,
  findPingById,
  createPing,
  updatePing,
  deletePing,
  togglePublic,
  addCategoryToPing,
  deleteCategoryFromPing,
  findCategoryByPingId,
};
