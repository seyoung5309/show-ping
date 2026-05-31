const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// 회원 가입
const {
  findByEmail,
  findByNickname,
  createUser,
  createProfile,
} = require("../models/userModel");

// 닉네임 중복 확인
const checkNickname = async (req, res) => {
  const { nickname } = req.body;

  if (!nickname) {
    return res.status(400).json({ message: "닉네임을 입력해주세요." });
  }

  const existing = await findByNickname(nickname);
  if (existing) {
    return res.status(409).json({ message: "이미 사용 중인 닉네임입니다." });
  }

  res.status(200).json({ message: "사용 가능한 닉네임입니다." });
};

// 회원가입
const signup = async (req, res) => {
  const { email, password, passwordConfirm, nickname } = req.body;

  // 필수 값 확인
  if (!email || !password || !passwordConfirm || !nickname) {
    return res.status(400).json({ message: "모든 항목을 입력해주세요." });
  }

  // 비밀번호 재입력 확인
  if (password !== passwordConfirm) {
    return res.status(400).json({ message: "비밀번호가 일치하지 않습니다." });
  }

  // 이메일 중복 확인
  const existingEmail = await findByEmail(email);
  if (existingEmail) {
    return res.status(409).json({ message: "이미 사용 중인 이메일입니다." });
  }

  // 비밀번호 해시
  const hashedPassword = await bcrypt.hash(password, 10);

  // DB INSERT
  const userId = await createUser(email, hashedPassword);
  await createProfile(userId, nickname);

  res.status(201).json({ message: "회원가입이 완료되었습니다." });
};

// 로그인
const { findUserByEmail } = require("../models/userModel");

const login = async (req, res) => {
  const { email, password } = req.body;

  // 필수 값 확인
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "이메일과 비밀번호를 입력해주세요." });
  }

  // 이메일 확인
  const user = await findUserByEmail(email);
  if (!user) {
    return res.status(401).json({ message: "존재하지 않는 이메일입니다." });
  }

  // 비밀번호 확인
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return res.status(401).json({ message: "비밀번호가 올바르지 않습니다." });
  }

  // JWT 토큰 발급
  const token = jwt.sign(
    { id: user.id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "7d" },
  );

  res.status(200).json({ message: "로그인 성공", token });
};

module.exports = { checkNickname, signup, login };
