import express from "express";
import {
  createOrder,
  createRazorpayOrder,
  deleteOrder,
  getAllOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus,
  verifyPayment,
} from "../controllers/order.controller.js";
import protect from "../middleware/auth.js";
import adminOnly from "../middleware/admin.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getAllOrders)
  .post(createOrder);

router.get("/my-orders", getMyOrders);
router.post("/create-razorpay-order", createRazorpayOrder);
router.post("/verify-payment", verifyPayment);

router.route("/:id")
  .get(getOrderById)
  .patch(adminOnly, updateOrderStatus)
  .delete(adminOnly, deleteOrder);

export default router;
