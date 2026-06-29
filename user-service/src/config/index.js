import dotenv from 'dotenv';
import packageJson from "../../package.json" with { type: "json" };

const SERVICE_NAME = packageJson.name;
dotenv.config();

export const config = {
    SERVICE_NAME: SERVICE_NAME,
    PORT: Number(process.env.PORT) || 4001,
    NODE_ENV: process.env.NODE_ENV || "development",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    REDIS_URL: process.env.REDIS_URL || "redis://:irctcpass1@localhost:6379",
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "http://localhost:4001",

    // it tells how long the OTP is valid in seconds, default is 5 minutes (300 seconds)
    OTP_TTL: process.env.OTP_TTL || 300,
    OTP_RATE_MAX_PER_HOUR: process.env.OTP_RATE_MAX_PER_HOUR || 5,
    OTP_MAX_VERIFY_ATTEMPTS: process.env.OTP_MAX_VERIFY_ATTEMPTS || 5,
    OTP_HMAC_SECRET: process.env.OTP_HMAC_SECRET || "09dc0abbb2961391d822610b31b912e3231d4d2745c76b1ef4765af4c62f6079",
}

