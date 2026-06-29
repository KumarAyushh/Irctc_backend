import prisma from "../config/prisma.js"
import {ConflictError} from "../utils/error.js"
import {sendOtpEmail} from "../utils/email.js"
import {generateAndStoreOtp} from "../utils/otp.js"
import crypto from "crypto"
import bcrypt from "bcryptjs"
export const  generateOtp = async (firstName, lastName, email, password) => {
    
    // Check if a user with this email already exists
    const existingUser = await prisma.user.findUnique({
        where: { email }
    });

    // Prevent duplicate registrations
    if (existingUser) {
        throw new ConflictError("User already exists");
    }

    // Hash the password before storing it anywhere
    const hashedPassword = await bcrypt.hash(password, 12);

    // Store user details temporarily until OTP verification succeeds
    const meta = {
        firstName,
        lastName,
        email,
        hashedPassword
    };

    // Generate OTP and save OTP + user metadata in Redis
    const { otp, otpSessionId } = await generateAndStoreOtp(meta);

    // Send OTP to the user's email
    await sendOtpEmail(email, otp);

    // Return session id so it can be used during OTP verification
    return { otpSessionId };
};

 