// Import Express framework
import express from "express";

// Middleware to parse cookies from incoming requests
import cookieParser from "cookie-parser";

// Security middleware that sets various HTTP headers
import helmet from "helmet";

// Import application configuration variables
import {config} from "./config/index.js"

// Import custom logger
import logger from "./config/logger.js"

// Import custom CORS middleware
import {corsMiddleware} from "./middlewares/cors.middleware.js"

// Import global error handling middleware
import errorHandler from "./middlewares/error.middleware.js";

// Import request logging middleware
import reqLogger from "./middlewares/req.middleware.js"

// Import authentication routes
import authRoute from "./routes/authRoute.js"

// Create an Express application instance
const app = express();

// Add security headers
app.use(helmet());

// Parse cookies and make them available in req.cookies
app.use(cookieParser());

// Parse incoming JSON request bodies
app.use(express.json());

// Log details of every incoming request
app.use(reqLogger);

// Handle Cross-Origin Resource Sharing rules
app.use(corsMiddleware);

app.use("/api/v1/auth", authRoute);


// Root route for testing server availability
app.get("/", (req, res) => {
    res.send("hello from index.js of user-service")
})

// Health check endpoint for monitoring services
app.get("/health", (req, res) => {
    res.status(200).json({
        message: "ok"
    })
})

// Global error handling middleware (should be registered last)
app.use(errorHandler);

// Function to start the Express server
const startServer = async () => {
    try {

        // Start listening on the configured port
        const server = app.listen(config.PORT, () => {

            // Log successful server startup
            logger.info(`${config.SERVICE_NAME} is running on port ${config.PORT}`);
        })

    } catch (error) {

        // Log startup errors
        logger.error("Failed to start server", error);

        // Exit the process with failure code
        process.exit(1);
    }
}

// Invoke the server startup function
startServer();