import express from "express";
import {
  createProduct,
  deleteProduct,
  getAllOrders,
  getAllProducts,
  getAllUsers,
  getDashboardStats,
  updateOrderStatus,
  updateProduct,
  updateUserRole,
} from "../controllers/admin.controller.js";
import protect from "../middleware/auth.js";
import adminOnly from "../middleware/admin.js";

const router = express.Router();

router.use(protect, adminOnly);

router.get("/stats", getDashboardStats);
router.get("/users", getAllUsers);
router.put("/users/:id/role", updateUserRole);
router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus);
router.get("/products", getAllProducts);
router.post("/products", createProduct);
router.put("/products/:id", updateProduct);
router.delete("/products/:id", deleteProduct);

export default router;
