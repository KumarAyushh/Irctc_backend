import prisma from "../config/prisma.js"
import {ConflictError, BadRequestError} from "../utils/error.js"
import {sendOtpEmail, verifyOtpEmail} from "../utils/email.js"
import {generateAndStoreOtp, verifyHashedOtp} from "../utils/otp.js"
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

export const verifyOtp = async(otp, otpSessionId) => {
    const meta = await verifyHashedOtp(otp, otpSessionId);
    if(meta === null){
        throw new BadRequestError("Invalid or expired OTP");
    }
    const user = await prisma.user.create({
        data : {
            firstName: meta.firstName,
            lastName: meta.lastName,
            email: meta.email,
            password: meta.hashedPassword,
            emailVerified: true

        }
    })

    await verifyOtpEmail(meta);
    return user;
}

 