
import express from "express";
import mongoose from "mongoose";
import Order from "../models/Order.js";
import Product from "../models/Product.js";
import User from "../models/User.js";
import customerAuthMiddleware from "../middleware/customerAuthMiddleware.js";
import authMiddleware from "../middleware/authMiddleware.js";

const router = express.Router();

// Generate a unique order number
const generateOrderNumber = () => {
  return `NVS-${Date.now()}-${Math.floor(1000 + Math.random() * 9000)}`;
};

// CUSTOMER: Place an order
// POST /api/orders
router.post("/", customerAuthMiddleware, async (req, res) => {
  const session = await mongoose.startSession();

  try {
    const { items, shippingAddress, paymentMethod } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Your cart is empty."
      });
    }

    if (!shippingAddress || !paymentMethod) {
      return res.status(400).json({
        success: false,
        message: "Shipping address and payment method are required."
      });
    }

    // COD is the only supported payment method for now
    if (paymentMethod !== "COD") {
      return res.status(400).json({
        success: false,
        message: "Only Cash on Delivery is currently available."
      });
    }

    const requiredAddressFields = [
      "fullName",
      "phone",
      "addressLine",
      "city",
      "state",
      "postalCode"
    ];

    for (const field of requiredAddressFields) {
      if (
        typeof shippingAddress[field] !== "string" ||
        !shippingAddress[field].trim()
      ) {
        return res.status(400).json({
          success: false,
          message: `${field} is required.`
        });
      }
    }

    const productIds = new Set();

    for (const item of items) {
      if (
        !item.productId ||
        !mongoose.isValidObjectId(item.productId) ||
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          success: false,
          message: "Invalid product or quantity."
        });
      }

      if (productIds.has(item.productId)) {
        return res.status(400).json({
          success: false,
          message: "Duplicate products are not allowed in the order."
        });
      }

      productIds.add(item.productId);
    }

    const customer = await User.findById(req.user.id);

    if (!customer) {
      return res.status(404).json({
        success: false,
        message: "Customer account not found."
      });
    }

    let orderItems = [];
    let subtotal = 0;

    await session.withTransaction(async () => {
      orderItems = [];
      subtotal = 0;

      for (const item of items) {
        // Atomically reserve stock and retrieve the current product
        const product = await Product.findOneAndUpdate(
          {
            _id: item.productId,
            stock: { $gte: item.quantity },
            isAvailable: true
          },
          {
            $inc: { stock: -item.quantity }
          },
          {
            new: true,
            session
          }
        );

        if (!product) {
          throw new Error(
            `Product ${item.productId} is unavailable or has insufficient stock.`
          );
        }

        const itemTotal = product.price * item.quantity;
        subtotal += itemTotal;

        orderItems.push({
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.price,
          quantity: item.quantity
        });
      }

      const shippingFee = 0;

      const order = await Order.create(
        [
          {
            orderNumber: generateOrderNumber(),
            customer: customer._id,
            items: orderItems,
            shippingAddress: {
              ...shippingAddress,
              country: shippingAddress.country || "India"
            },
            subtotal,
            shippingFee,
            totalAmount: subtotal + shippingFee,
            paymentMethod: "COD",
            paymentStatus: "PENDING",
            orderStatus: "PLACED"
          }
        ],
        { session }
      );

      orderItems = order;
    });

    return res.status(201).json({
      success: true,
      message: "Your order has been placed successfully!",
      order: orderItems[0]
    });

  } catch (error) {
    console.error("Place order error:", error);

    return res.status(400).json({
      success: false,
      message: error.message || "Unable to place your order."
    });

  } finally {
    await session.endSession();
  }
});

// CUSTOMER: View own orders
// GET /api/orders/my-orders
router.get("/my-orders", customerAuthMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({
      customer: req.user.id
    }).sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error("Fetch customer orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch your orders."
    });
  }
});

// CUSTOMER: View one own order
// GET /api/orders/:id
router.get("/:id", customerAuthMiddleware, async (req, res) => {
  try {
    if (!mongoose.isValidObjectId(req.params.id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order ID."
      });
    }

    const order = await Order.findOne({
      _id: req.params.id,
      customer: req.user.id
    });

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    return res.status(200).json({
      success: true,
      order
    });

  } catch (error) {
    console.error("Fetch order error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch order."
    });
  }
});

// ADMIN: View all orders
// GET /api/orders/admin/all
router.get("/admin/all", authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("customer", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      count: orders.length,
      orders
    });

  } catch (error) {
    console.error("Fetch all orders error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch orders."
    });
  }
});

// ADMIN: Update order status
// PATCH /api/orders/admin/:id/status
router.patch("/admin/:id/status", authMiddleware, async (req, res) => {
  try {
    const allowedStatuses = [
      "CONFIRMED",
      "PROCESSING",
      "SHIPPED",
      "DELIVERED",
      "CANCELLED"
    ];

    const { orderStatus } = req.body;

    if (!allowedStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: "Invalid order status."
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found."
      });
    }

    order.orderStatus = orderStatus;
    await order.save();

    return res.status(200).json({
      success: true,
      message: "Order status updated successfully!",
      order
    });

  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to update order status."
    });
  }
});

export default router;
