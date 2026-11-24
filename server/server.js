
import dns from "node:dns";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Home route
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

// Start server
const startServer = async () => {
  try {
    // Import database and routes
    const { default: connectDB } =
      await import("./config/db.js");

    const { default: productRoutes } =
      await import("./routes/productRoutes.js");

    const { default: authRoutes } =
      await import("./routes/authRoutes.js");

    const { default: customerRoutes } =
      await import("./routes/customerRoutes.js");

    const { default: orderRoutes } =
      await import("./routes/orderRoutes.js");

    // Connect MongoDB
    await connectDB();

    // Register API routes
    app.use("/api/products", productRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/customer", customerRoutes);
    app.use("/api/orders", orderRoutes);

    // Start listening
    const PORT = process.env.PORT || 5000;

    app.listen(PORT, () => {
      console.log("--------------------------------");
      console.log("Nailverse server running on port", PORT);
      console.log("--------------------------------");
      console.log("Product API: /api/products");
      console.log("Auth API: /api/auth");
      console.log("Customer API: /api/customer");
      console.log("Orders API: /api/orders");
      console.log("--------------------------------");
    });

  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();
