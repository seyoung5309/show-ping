const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getGroups,
  createGroup,
  updateGroup,
  deleteGroup,
  togglePublic,
  addPingToGroup,
  removePingFromGroup,
  getPingsInGroup,
} = require("../controllers/groupController");

router.get("/", auth, getGroups); // 그룹 전체 조회
router.post("/", auth, createGroup); // 그룹 생성
router.put("/:id", auth, updateGroup); // 그룹 수정
router.delete("/:id", auth, deleteGroup); // 그룹 삭제
router.patch("/:id/public", auth, togglePublic); // 공개/비공개
router.post("/:id/pings", auth, addPingToGroup); // 그룹에 상품 추가
router.delete("/:id/pings/:pingId", auth, removePingFromGroup); // 그룹에서 상품 제거
router.get("/:id/pings", auth, getPingsInGroup); // 그룹 내 상품 목록

module.exports = router;
