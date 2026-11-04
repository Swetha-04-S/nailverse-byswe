
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to NailverseBySwe API!");
});

app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Nailverse backend is running!"
  });
});

const startServer = async () => {
  try {
    const { default: connectDB } = await import("./config/db.js");

    await connectDB();

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Nailverse server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
