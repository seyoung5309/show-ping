const pool = require("../db");

// 프로필 조회
const findProfileByUserId = async (userId) => {
  const [rows] = await pool.query("SELECT * FROM profile WHERE user_id = ?", [
    userId,
  ]);
  return rows[0];
};

// 관심사 조회
const findCategoriesByUserId = async (userId) => {
  const [rows] = await pool.query(
    `SELECT c.id, c.name FROM categories c
     JOIN category_with_user cwu ON cwu.category_id = c.id
     WHERE cwu.user_id = ?`,
    [userId],
  );
  return rows;
};

// 프로필 수정
const updateProfile = async (userId, nickname, comment) => {
  await pool.query(
    "UPDATE profile SET nickname = ?, comment = ? WHERE user_id = ?",
    [nickname, comment, userId],
  );
};

// 프로필 이미지 수정
const updateProfileImage = async (userId, image) => {
  await pool.query("UPDATE profile SET image = ? WHERE user_id = ?", [
    image,
    userId,
  ]);
};

// 관심사 삭제
const deleteCategoriesByUserId = async (userId) => {
  await pool.query("DELETE FROM category_with_user WHERE user_id = ?", [
    userId,
  ]);
};

// 관심사 추가
const addCategoryToUser = async (userId, categoryId) => {
  await pool.query(
    "INSERT INTO category_with_user (user_id, category_id) VALUES (?, ?)",
    [userId, categoryId],
  );
};

// 공개된 위시리스트 조회
const findPublicPingsByUserId = async (userId, categoryId, sort = "latest") => {
  let query = `SELECT DISTINCT p.* FROM pings p `;
  const params = [userId];

  if (categoryId) {
    query += `JOIN category_with_ping cwp ON cwp.ping_id = p.id `;
  }

  query += `WHERE p.user_id = ? AND p.is_public = 1 `;

  if (categoryId) {
    query += `AND cwp.category_id = ? `;
    params.push(categoryId);
  }

  switch (sort) {
    case "oldest":
      query += `ORDER BY p.created_at ASC`;
      break;
    case "low":
      query += `ORDER BY p.price ASC`;
      break;
    case "high":
      query += `ORDER BY p.price DESC`;
      break;
    case "name":
      query += `ORDER BY p.name ASC`;
      break;
    default:
      query += `ORDER BY p.created_at DESC`;
      break;
  }

  const [rows] = await pool.query(query, params);
  return rows;
};

// 공개된 그룹 조회
const findPublicGroupsByUserId = async (userId) => {
  const [rows] = await pool.query(
    "SELECT * FROM ping_groups WHERE user_id = ? AND is_public = 1 ORDER BY created_at ASC",
    [userId],
  );
  return rows;
};

module.exports = {
  findProfileByUserId,
  findCategoriesByUserId,
  updateProfile,
  updateProfileImage,
  deleteCategoriesByUserId,
  addCategoryToUser,
  findPublicPingsByUserId,
  findPublicGroupsByUserId,
};
