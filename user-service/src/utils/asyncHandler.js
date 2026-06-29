// utils/asyncHandler.js
//this async handle is a middlware wrapper for async functions to catch errors and pass them to the next middleware (error handler)
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next))
        .catch(next);

export default asyncHandler;