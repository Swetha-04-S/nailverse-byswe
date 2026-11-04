
import express from "express";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/login", (req, res) => {
  const { username, password } = req.body;

  if (
    !username ||
    !password ||
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({
      success: false,
      message: "Invalid username or password."
    });
  }

  const token = jwt.sign(
    {
      username,
      role: "admin"
    },
    process.env.JWT_SECRET,
    { expiresIn: "8h" }
  );

  res.json({
    success: true,
    message: "Admin login successful!",
    token
  });
});

export default router;
