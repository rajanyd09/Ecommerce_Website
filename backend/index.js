import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import path from "path";
import orderRoutes from "./routes/orderRoutes.js";
import configRoutes from "./routes/configRoutes.js";
import cors from "cors";

dotenv.config();

const app = express();

// CORS
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Body parser
app.use(express.json());

// STATIC FILES - MUST BE BEFORE ROUTES
const __dirname = path.resolve();
app.use("/uploads", express.static(path.join(__dirname, "uploads"))); // ✅ FIXED: Moved UP

// Connect DB
connectDB();

// Routes - ALL AFTER static middleware
app.get("/", (req, res) => {
  res.send("API running...");
});

app.use("/api/users", userRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/product", productRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/config", configRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
