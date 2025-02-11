import jwt from "jsonwebtoken";
import HttpError from "../utils/httpError.js";
import Auth from "../models/authModel.js";


export const authenticateUser = async (req, res, next) => {
  try {
    // Retrieve token from HttpOnly cookie or Authorization header
    const token = req.cookies["jwt-token"] || req.headers["authorization"]?.split(" ")[1];
    if (!token) return next(new HttpError("You are not logged in! Please log in.", 401));

    const decoded = jwt.verify(token, process.env.JWT_SECRET_TOKEN);

    const user = await Auth.findById(decoded.id).select("-password");
    if (!user) return next(new HttpError("User not found", 404));

    if (user.isBlocked) {
        res.clearCookie("jwt-token");
        return next(new HttpError("Your account has been blocked. Please contact admin.", 403));
    }

    req.user = user; 
    next();
  } catch (error) {
    console.log("Error in user authentication middleware:", error.message);
    return next(new HttpError("Token is invalid or has expired", 401));
  }
};