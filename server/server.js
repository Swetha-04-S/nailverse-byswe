
import dns from "node:dns";

// MongoDB DNS workaround
dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

// Basic route
app.get("/", (req, res) => {
  res.send("Welcome to NailverseBySwe API!");
});

// Health check
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Nailverse backend is running!"
  });
});

const startServer = async () => {
  try {
    // Load database and product routes after DNS configuration
    const { default: connectDB } = await import("./config/db.js");
    const { default: productRoutes } = await import("./routes/productRoutes.js");

    await connectDB();

    // Register product routes
    app.use("/api/products", productRoutes);

    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log(`Nailverse server running on port ${PORT}`);
      console.log("Product API: http://localhost:5000/api/products");
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
