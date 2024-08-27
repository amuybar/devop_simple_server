require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const authMiddleware = require("./middleware/auth");

const app = express();
const port = 5000;

// Middleware
app.use(express.json());

// Routes
app.use("/auth", authRoutes);

// Protected Route Example
app.get("/protected", authMiddleware, (req, res) => {
  res.send("This is a protected route");
});

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() =>
    app.listen(port, () =>
      console.log(`Server running on http://localhost:${port}`)
    )
  )
  .catch((err) => console.error("MongoDB connection error:", err));
