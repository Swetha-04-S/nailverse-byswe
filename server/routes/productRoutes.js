
import express from "express";
import Product from "../models/Product.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: Get all products
router.get("/", async (req, res) => {
  try {
    const products = await Product.find().sort({ createdAt: -1 });
    res.json({ success: true, count: products.length, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Public: Get one product
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({ success: true, product });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID"
    });
  }
});

// Admin only: Create product
router.post("/", authMiddleware, async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json({
      success: true,
      message: "Product added successfully!",
      product
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Admin only: Update product
router.put("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product updated successfully!",
      product
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

// Admin only: Delete product
router.delete("/:id", authMiddleware, async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    res.json({
      success: true,
      message: "Product deleted successfully!"
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: "Invalid product ID"
    });
  }
});

export default router;
