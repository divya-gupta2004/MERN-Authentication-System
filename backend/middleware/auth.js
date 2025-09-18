import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./error.js";
import jwt from "jsonwebtoken";
import { User } from "../modal/userModel.js";

export const isAuthenticated = catchAsyncError(async (req, res, next) => {
    // Get token from cookies
    const { authToken } = req.cookies;

    if (!authToken) {
        return next(new ErrorHandler("Login first to access this resource", 401)); // 401 instead of 400
    }

    try {
        // Verify token
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET_KEY);
        // Fetch user from DB
        const user = await User.findById(decoded.id);

        if (!user) {
            return next(new ErrorHandler("User not found", 404));
        }

        req.user = user; // attach user to req
        next();
    } catch (error) {
        return next(new ErrorHandler("Invalid or expired token", 401));
    }
});
