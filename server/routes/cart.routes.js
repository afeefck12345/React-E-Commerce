import express from "express";
import {
  addToCart,
  clearCart,
  getCart,
  removeFromCart,
  updateCartItem,
} from "../controllers/cart.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getCart)
  .post(addToCart)
  .delete(clearCart);

router.route("/:productId")
  .put(updateCartItem)
  .patch(updateCartItem)
  .delete(removeFromCart);

export default router;
