import express from "express";
const router = express.Router();

// Get PayPal Client ID
router.get("/paypal", (req, res) => {
  res.send({ clientId: process.env.PAYPAL_CLIENT_ID });
});

export default router;
