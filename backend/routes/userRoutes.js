const express = require("express");
const {
  registerUser,
  loginUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUserById,
  getUserById,
  updateUserById,
} = require("../controllers/userController.js");
const { protect, authorizeAdmin } = require("../middleware/authMiddleware");

const router = express.Router();

router.route("/").post(registerUser).get(protect, authorizeAdmin, getAllUsers);

router.post("/auth", loginUser); // Public

router
  .route("/profile")
  .get(protect, getCurrentUserProfile)
  .put(protect, updateCurrentUserProfile);

router
  .route("/:id")
  .delete(protect, authorizeAdmin, deleteUserById)
  .get(protect, authorizeAdmin, getUserById)
  .put(protect, authorizeAdmin, updateUserById);

module.exports = router;
