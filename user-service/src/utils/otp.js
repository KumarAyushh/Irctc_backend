import {TooManyRequestsError} from "./error.js";
import otpGenerator from "otp-generator";
import { redis } from "../config/redis.js";
import { config } from "../config/index.js";
import crypto from "node:crypto";
// Maximum OTP requests allowed per email within 1 hour
const RATE_MAX = parseInt(config.OTP_RATE_MAX_PER_HOUR || "10", 10);

//this secret is used to create a hash of the OTP, so that we don't store the actual OTP in Redis. Instead, we store its hash and compare hashes during verification.
const HMAC_SECRET = config.OTP_HMAC_SECRET

// OTP expiration time in seconds (default: 5 minutes)
const OTP_TTL = parseInt(config.OTP_TTL || "300", 10);

/**
 * Creates a secure HMAC hash of the OTP.
 * We never store the actual OTP in Redis.
 * Instead, we store its hash and compare hashes during verification.
 */
function hmacFor(email, otp) {
  return crypto
    .createHmac("sha256", HMAC_SECRET)
    .update(email + ":" + otp) // Bind OTP to email
    .digest("hex");
}

async function generateAndStoreOtp(meta) {

  // Redis key used to track OTP requests for a specific email
  // Example: otp:rate ayush@gmail.com
  const rateKey = `otp:rate ${meta.email}`;

  // Get number of OTPs already sent in the current hour
  const sentCount = parseInt((await redis.get(rateKey)) || "0", 10);

  // Enforce rate limiting
  if (sentCount >= RATE_MAX) {
    throw new TooManyRequestsError(
      "Too many OTP requests. Please try again later.",
      "OTP_RATE_LIMIT",
    );
  }

  // Generate a 6-digit numeric OTP
  const otp = otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
  });

  // Create a unique session ID for this OTP flow
  const otpSessionId = crypto.randomUUID();

  // Hash OTP before storing it
  const hashedOtp = hmacFor(meta.email, otp);

  // Store OTP session data in Redis
  await redis.set(
    `otp:session:${otpSessionId}`,
    JSON.stringify({
      hashedOtp,
      meta, // firstName, lastName, email, hashedPassword
    }),
    "EX",
    OTP_TTL // Auto-delete after OTP expiry
  );

  // Increase OTP request count for rate limiting
  const count = await redis.incr(rateKey);

  // Keep rate limit counter alive for 1 hour
  if (count === 1) {
  await redis.expire(rateKey, 3600);
}

  // Return OTP for email sending and session ID for tracking
  return { otp, otpSessionId };
}

export { generateAndStoreOtp };