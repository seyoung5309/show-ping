const pool = require("../db");

// 이메일 중복 확인
const findByEmail = async (email) => {
  const [rows] = await pool.query("SELECT id FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

// 닉네임 중복 확인
const findByNickname = async (nickname) => {
  const [rows] = await pool.query(
    "SELECT user_id FROM profile WHERE nickname = ?",
    [nickname],
  );
  return rows[0];
};

// 회원 가입
const createUser = async (email, hashedPassword) => {
  const [result] = await pool.query(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hashedPassword],
  );
  return result.insertId;
};

// 프로필 생성
const createProfile = async (userId, nickname) => {
  await pool.query("INSERT INTO profile (user_id, nickname) VALUES (?, ?)", [
    userId,
    nickname,
  ]);
};

module.exports = { findByEmail, findByNickname, createUser, createProfile };
