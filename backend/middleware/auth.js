const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Bearer 토큰 추출

  if (!token) {
    return res.status(401).json({ message: "토큰이 없습니다." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // 이후 컨트롤러에서 req.user.id로 사용자 ID 접근 가능
    next();
  } catch (err) {
    return res.status(403).json({ message: "유효하지 않은 토큰입니다." });
  }
};

module.exports = auth;
