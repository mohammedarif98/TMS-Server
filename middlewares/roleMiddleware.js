import HttpError from "../utils/httpError.js";


export const authorizeRoles = (role) => {
  return (req, res, next) => {
    if (req.user.role !== role) {
      return next(new HttpError("Access Denied: Unauthorized role", 403));
    }
    next();
  };
};