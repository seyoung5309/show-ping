const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getPings,
  getPing,
  createPing,
  updatePing,
  deletePing,
  togglePublic,
} = require("../controllers/pingController");

router.get("/", auth, getPings); // 전체 목록 조회
router.get("/:id", auth, getPing); // 상세 조회
router.post("/", auth, createPing); // 추가
router.put("/:id", auth, updatePing); // 수정
router.delete("/:id", auth, deletePing); // 삭제
router.patch("/:id/public", auth, togglePublic); // 공개/비공개

module.exports = router;
