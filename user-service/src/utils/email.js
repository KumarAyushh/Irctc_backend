// utils/email.js

import sgMail from "@sendgrid/mail";
import { config } from "../config/index.js";
import dotenv from "dotenv";
dotenv.config();
console.log("API Key:", !!process.env.SENDGRID_API_KEY);
console.log("From Email:", process.env.SENDGRID_FROM_EMAIL);
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

export const sendOtpEmail = async (email, otp) => {
  const msg = {
    to: email,
    from: process.env.SENDGRID_FROM_EMAIL, // Verified sender in SendGrid
    subject: "Your OTP Verification Code",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2>Email Verification</h2>

        <p>Your OTP is:</p>

        <div style="
          font-size: 32px;
          font-weight: bold;
          letter-spacing: 5px;
          color: #2563eb;
          margin: 20px 0;
        ">
          ${otp}
        </div>

        <p>This OTP will expire in <strong>10 minutes</strong>.</p>

        <p>If you didn't request this OTP, please ignore this email.</p>

        <br />

        <p>Regards,</p>
        <p>IRCTC Team</p>
      </div>
    `,
  };

  await sgMail.send(msg);
};