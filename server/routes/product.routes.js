import express from "express";
import {
  createProduct,
  createReview,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../controllers/product.controller.js";
import protect from "../middleware/auth.js";
import adminOnly from "../middleware/admin.js";

const router = express.Router();

router.route("/")
  .get(getProducts)
  .post(protect, adminOnly, createProduct);

router.route("/:id")
  .get(getProductById)
  .put(protect, adminOnly, updateProduct)
  .patch(protect, adminOnly, updateProduct)
  .delete(protect, adminOnly, deleteProduct);

router.post("/:id/reviews", protect, createReview);

export default router;
