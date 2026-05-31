require("dotenv").config();
const express = require("express");
const app = express();

app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log("서버 실행 중: http://localhost:3000");
});
