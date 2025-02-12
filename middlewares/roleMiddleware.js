import HttpError from "../utils/HttpError.js";


// export const authorizeRoles = (role) => {
//   return (req, res, next) => {
//     if (req.user.role !== role) {
//       return next(new HttpError("Access Denied: Unauthorized role", 403));
//     }
//     next();
//   };
// };


export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
      if (!roles.includes(req.user.role)) {
          return next(
              new HttpError("You do not have permission to perform this action", 403)
          );
      }
      next();
  };
};