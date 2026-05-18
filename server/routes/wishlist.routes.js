import express from "express";
import {
  addToWishlist,
  getWishlist,
  removeFromWishlist,
} from "../controllers/wishlist.controller.js";
import protect from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.route("/")
  .get(getWishlist)
  .post(addToWishlist);

router.delete("/:productId", removeFromWishlist);

export default router;
