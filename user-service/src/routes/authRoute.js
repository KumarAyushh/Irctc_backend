import express from "express";
const router = express.Router();
import { sendOTP, verifyOTP } from "../controllers/auth.controller.js";

console.log("authRoute.js loaded");
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

console.log(router.stack.map(layer => layer.route?.path));

export default router;