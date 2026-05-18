import express from "express";
import {
  changePassword,
  getAllUsers,
  getProfile,
  updateAnyUser,
  updateProfile,
} from "../controllers/user.controller.js";
import protect from "../middleware/auth.js";
import adminOnly from "../middleware/admin.js";

const router = express.Router();

router.use(protect);

router.get("/", adminOnly, getAllUsers);

router.route("/profile")
  .get(getProfile)
  .put(updateProfile)
  .patch(updateProfile);

router.put("/change-password", changePassword);

router.patch("/:id", adminOnly, updateAnyUser);
router.put("/:id", adminOnly, updateAnyUser);

export default router;
