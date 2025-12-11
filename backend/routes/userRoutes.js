import express from "express";
import {
  registerUser,
  loginUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
  logoutCurrentUser,
} from "../controllers/userController.js";

import { protect, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(registerUser).get(protect, authorizeAdmin, getAllUsers);

router.post("/auth", loginUser); // Public
router.post("/logout", logoutCurrentUser);

router
  .route("/profile")
  .get(protect, getCurrentUserProfile)
  .put(protect, updateCurrentUserProfile);

router
  .route("/:id")
  .delete(protect, authorizeAdmin, deleteUserById)
  .get(protect, authorizeAdmin, getUserById)
  .put(protect, authorizeAdmin, updateUserById);

export default router;
