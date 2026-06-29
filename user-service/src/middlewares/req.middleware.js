import logger from "../config/logger.js";

//this middleware basically logs the incoming request method and url, and also logs the response status code and the time taken to process the request when the response is finished. It uses the logger instance to log these details at different levels (debug for incoming request and info for completed request).
const reqLogger = (req, res, next) => {
    logger.debug(`[${req.method}] ${req.originalUrl}`);
    const start = Date.now();

    res.on("finish", () => {
        const duration = Date.now() - start;
        logger.info(`[${req.method}] ${req.originalUrl} - status: ${res.statusCode} - ${duration}ms`);
    });
    next()
}

export default reqLogger;