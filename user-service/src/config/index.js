import dotenv from 'dotenv';
import packageJson from "../../package.json" with { type: "json" };

const SERVICE_NAME = packageJson.name;
dotenv.config();

export const config = {
    SERVICE_NAME: SERVICE_NAME,
    PORT: Number(process.env.PORT) || 4001,
    NODE_ENV: process.env.NODE_ENV || "development",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    //REDIS_URL:
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "http://localhost:4000",
}

