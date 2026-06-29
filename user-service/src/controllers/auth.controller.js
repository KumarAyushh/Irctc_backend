//map incoming req to correct route
import {config} from "../config/index.js";
import asyncHandler from "../utils/asyncHandler.js";
import { BadRequestError } from "../utils/error.js";
import {generateOtp} from "../services/authService.js";
export const sendOTP = asyncHandler(async (req, res) => {

    // Extract user details from request body
    const { firstName, lastName, email, password, confirmPassword } = req.body;

    // Validate that all required fields are provided
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
        throw new BadRequestError("All fields are mandatory");
    }

    // Ensure password and confirm password match
    if (password !== confirmPassword) {
        throw new BadRequestError("Password mismatch");
    }

    // Call service layer:
    // 1. Check if user already exists
    // 2. Hash password
    // 3. Generate OTP
    // 4. Store OTP + user metadata in Redis
    // 5. Send OTP email
    const { otpSessionId } = await generateOtp(
        firstName,
        lastName,
        email,
        password
    );

    // Store OTP session id in a secure HTTP-only cookie
    // Client-side JavaScript cannot access this cookie
    res.cookie("otpSessionId", otpSessionId, {
        httpOnly: true,
        secure: true,
        sameSite: "strict",
        maxAge: config.OTP_TTL * 1000
    })

    // Send success response to client
    .status(200)
    .json({
        success: true,
        message: "OTP sent successfully",
    });
});