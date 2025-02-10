import jwt from "jsonwebtoken";


export const generateToken = (userId, role) => {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET_TOKEN, {
      expiresIn: process.env.JWT_TOKEN_EXPIRES_IN,
    });
  };
  


export const verifyToken = (token) => {
    return jwt.verify(token, process.env.JWT_SECRET_TOKEN);
};


