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

export const verifyOtpEmail = async (meta) => {
  const msg = {
    to: meta.email,
    from: process.env.SENDGRID_FROM_EMAIL, // Verified sender in SendGrid
    subject: "Email Verified Successfully",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px;">
        <h2 style="color: #16a34a;">✅ Email Verified</h2>

        <p>Hello,</p>

        <p>Your email address has been <strong>successfully verified</strong>.</p>

        <p>You can now continue using all the features of your IRCTC account.</p>

        <br />

        <p>If you did not perform this verification, please contact our support team immediately.</p>

        <br />

        <p>Regards,</p>
        <p><strong>IRCTC Team</strong></p>
      </div>
    `,
  };

  await sgMail.send(msg);
};