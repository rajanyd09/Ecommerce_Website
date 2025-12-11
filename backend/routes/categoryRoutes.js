import express from "express";
import {
  createCategory,
  updateCategory,
  removeCategory,
  listCategory,
  readCategory,
} from "../controllers/categoryController.js";
import { protect, authorizeAdmin } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/").post(protect, authorizeAdmin, createCategory);

router
  .route("/:categoryId")
  .put(protect, authorizeAdmin, updateCategory)
  .delete(protect, authorizeAdmin, removeCategory);

router.route("/categories").get(listCategory);

router.route("/:id").get(readCategory);

export default router;
