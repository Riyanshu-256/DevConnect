const express = require("express");
const connectDB = require("./config/database");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, "../.env"),
});

const app = express();

/* ================== CORS CONFIG ================== */
const allowedOrigins = ["http://localhost:5173", "http://localhost:5174"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

/* ================== MIDDLEWARE ================== */
app.use(express.json());
app.use(cookieParser());

/* ================== ROUTES ================== */
app.use("/", require("./routes/authRouter"));
app.use("/", require("./routes/profileRouter"));
app.use("/", require("./routes/requestRouter"));
app.use("/", require("./routes/userRouter"));

/* ================== HEALTH CHECK ================== */
app.get("/", (req, res) => {
  res.send("Backend running 🚀");
});

/* ================== DB + SERVER ================== */
connectDB();

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});
