require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
  }),
);
app.use(express.json());

const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);

app.listen(3000, () => {
  console.log("서버 실행 중: http://localhost:3000");
});
