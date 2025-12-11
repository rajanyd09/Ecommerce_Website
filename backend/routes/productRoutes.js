import express from "express";
import formidable from "express-formidable";
const router = express.Router();

// controllers
import {
  addProduct,
  updateProductDetails,
  removeProduct,
  fetchProducts,
  fetchProductById,
  fetchAllProducts,
  addProductReview,
  fetchTopProducts,
  fetchNewProducts,
  filterProducts,
} from "../controllers/productController.js";
import { protect, authorizeAdmin } from "../middleware/authMiddleware.js";
import checkId from "../middleware/checkId.js";

router
  .route("/")
  .get(fetchProducts)
  .post(protect, authorizeAdmin, formidable(), addProduct);

router.route("/allproducts").get(fetchAllProducts);
router.route("/:id/reviews").post(protect, checkId, addProductReview);

router.get("/top", fetchTopProducts);
router.get("/new", fetchNewProducts);

router
  .route("/:id")
  .get(fetchProductById)
  .put(protect, authorizeAdmin, formidable(), updateProductDetails)
  .delete(protect, authorizeAdmin, removeProduct);

router.route("/filtered-products").post(filterProducts);

export default router;
