require("dotenv").config();

const express = require("express");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes");
const taskRoutes = require("./routes/taskRoutes");
const aiRoutes = require("./routes/aiRoutes");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  }),
);

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);
app.use("/api/ai", aiRoutes);

// Home API
app.get("/", (req, res) => {
  res.send("Welcome to SmartTask AI Backend!");
});

// Tasks API
app.get("/api/tasks", (req, res) => {
  res.json({
    message: "Tasks API is working!",
    tasks: [],
  });
});

// Start server after database connection
const startServer = async () => {
  await connectDB();

  app.listen(5001, () => {
    console.log("Backend server running on port 5001");
  });
};

startServer();
