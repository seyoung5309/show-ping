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

const pingRoutes = require("./routes/pingRoutes");
app.use("/api/pings", pingRoutes);

const groupRoutes = require("./routes/groupRoutes");
app.use("/api/groups", groupRoutes);

const propertyRoutes = require("./routes/propertyRoutes");
app.use("/api/properties", propertyRoutes);

const categoryRoutes = require("./routes/categoryRoutes");
app.use("/api/categories", categoryRoutes);

app.use("/uploads", express.static("uploads"));

const profileRoutes = require("./routes/profileRoutes");
app.use("/api/profile", profileRoutes);

app.listen(3000, () => {
  console.log("서버 실행 중: http://localhost:3000");
});
