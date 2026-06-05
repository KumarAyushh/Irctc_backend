import express from "express";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import {config} from "./config/index.js"
//import logger from "./config/logger"
//import {corsMiddleware} from "./middlewares/corsMiddleware"
import errorHandler from "./middlewares/error.middleware.js";
import reqLogger from "./middlewares/reqLogger"
const app = express();

app.use(helmet());
app.use(cookieParser());
app.use(express.json());
// app.use(reqLogger);
app.use(corsMiddleware);


app.get("/", (req, res) => {
    res.send("hello from index.js of user-service")
})

app.get("/health", (req, res) => {
    res.status(200).json({
        message: "ok"
    })
})

app.use(errorHandler);

const startServer = async () => {
    try {
        const server = app.listen(config.PORT, () => {
            logger.info(`${config.SERVICE_NAME} is running on port ${config.PORT}`);
        })
    } catch (error) {
        logger.error("Failed to start server", error);
        process.exit(1);
    }
}

startServer();