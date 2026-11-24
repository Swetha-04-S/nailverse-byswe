
import express from "express";
import User from "../models/User.js";
import customerAuthMiddleware from "../middleware/customerAuthMiddleware.js";

const router = express.Router();

// ==========================================
// GET LOGGED-IN CUSTOMER PROFILE
// GET /api/customer/me
// ==========================================

router.get("/me", customerAuthMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "Customer account not found."
      });
    }

    return res.status(200).json({
      success: true,
      message: "Customer profile fetched successfully!",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("Customer profile error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch customer profile."
    });
  }
});

export default router;

