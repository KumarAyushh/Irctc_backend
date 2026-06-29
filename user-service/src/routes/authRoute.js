import express from "express";
const router = express.Router();
import { sendOTP } from "../controllers/auth.controller.js";

console.log("authRoute.js loaded");
router.post("/send-otp", sendOTP);

console.log(router.stack.map(layer => layer.route?.path));

export default router;