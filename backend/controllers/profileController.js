const pool = require("../db");

const {
  findProfileByUserId,
  findCategoriesByUserId,
  updateProfile,
  updateProfileImage,
  deleteCategoriesByUserId,
  addCategoryToUser,
  findPublicPingsByUserId,
  findPublicGroupsByUserId,
} = require("../models/profileModel");

const fs = require("fs");
const path = require("path");

// 프로필 조회
const getProfile = async (req, res) => {
  const profile = await findProfileByUserId(req.user.id);
  if (!profile)
    return res.status(404).json({ message: "프로필을 찾을 수 없습니다." });
  const categories = await findCategoriesByUserId(req.user.id);
  res.status(200).json({ ...profile, categories });
};

// 프로필 수정
const updateProfileController = async (req, res) => {
  const { nickname, comment, categoryIds } = req.body;
  if (!nickname)
    return res.status(400).json({ message: "닉네임은 필수입니다." });
  await updateProfile(req.user.id, nickname, comment);
  if (categoryIds) {
    await deleteCategoriesByUserId(req.user.id);
    const ids = JSON.parse(categoryIds);
    for (const categoryId of ids) {
      await addCategoryToUser(req.user.id, categoryId);
    }
  }
  res.status(200).json({ message: "프로필이 수정되었습니다." });
};

// 프로필 이미지 업로드
const uploadProfileImage = async (req, res) => {
  if (!req.file)
    return res.status(400).json({ message: "이미지를 업로드해주세요." });

  // 기존 이미지 삭제
  const profile = await findProfileByUserId(req.user.id);
  if (profile.image) {
    const oldPath = path.join(__dirname, "..", profile.image);
    if (fs.existsSync(oldPath)) {
      fs.unlinkSync(oldPath);
    }
  }

  const image = `/uploads/${req.file.filename}`;
  await updateProfileImage(req.user.id, image);
  res.status(200).json({ message: "프로필 이미지가 업로드되었습니다.", image });
};

// 공개된 위시리스트 조회
const getPublicPings = async (req, res) => {
  const { categoryId, sort = "latest" } = req.query;
  const pings = await findPublicPingsByUserId(req.user.id, categoryId, sort);
  res.status(200).json(pings);
};

// 공개된 그룹 조회
const getPublicGroups = async (req, res) => {
  const groups = await findPublicGroupsByUserId(req.user.id);
  res.status(200).json(groups);
};

const togglePublic = async (req, res) => {
  const profile = await findProfileByUserId(req.user.id);
  if (!profile)
    return res.status(404).json({ message: "프로필을 찾을 수 없습니다." });
  await pool.query(
    "UPDATE profile SET is_public = NOT is_public WHERE user_id = ?",
    [req.user.id],
  );
  res.status(200).json({ message: "공개 여부가 변경되었습니다." });
};

// 다른 사용자 프로필 조회
const getUserProfile = async (req, res) => {
  const profile = await findProfileByUserId(req.params.userId);
  if (!profile)
    return res.status(404).json({ message: "프로필을 찾을 수 없습니다." });
  if (!profile.is_public)
    return res.status(403).json({ message: "비공개 프로필입니다." });
  const categories = await findCategoriesByUserId(req.params.userId);
  const pings = await findPublicPingsByUserId(req.params.userId);
  const groups = await findPublicGroupsByUserId(req.params.userId);
  res.status(200).json({ ...profile, categories, pings, groups });
};

module.exports = {
  getProfile,
  updateProfile: updateProfileController,
  uploadProfileImage,
  getPublicPings,
  getPublicGroups,
  togglePublic,
  getUserProfile,
};
