import HttpError from "../utils/httpError.js";
import Auth from "../models/authModel.js";
import { generateToken } from "../utils/jwt.js";
// import bcrypt from "bcrypt";

export const registration = async(req, res, next) => {
    try{
        const { username, email, password, confirmPassword } = req.body;

        if(!username || !email || !password || !confirmPassword){
            return next(new HttpError("All fields are required", 400));
        }
        if( password !== confirmPassword){
            return next(new HttpError("Password do not match", 400))
        }

        const userExist = await Auth.findOne({ email });
        if(userExist) return next(new HttpError("User already exist", 400));

        const user = await Auth.create({ username, email, password });

        const { password: userpassword, ...rest } = user.toObject();

        return res.status(201).json({
            status: "success",
            message: "User registered successfully",
            user: rest
        });
    }catch(error){
        next(error);
    }
}


export const login = async(req, res, next) => {
    try{
        const { email, password } = req.body;
        
        if(!email || !password){
            return next(new HttpError("Email and Password are required", 400));
        }

        const user = await Auth.findOne({ email }).select("+password");
        if(!user){
            return next(new HttpError("Invalid Email or Password", 401))
        }

        if (user.isBlocked) {
            return next(new HttpError("User is blocked", 403));
        }

        const validPassword = await user.comparePassword(password);
        if (!validPassword) {
            return next(new HttpError("Invalid email or password", 401));
        }

        const token = generateToken(user._id, user.role);

        res.cookie("jwt-token", token, {
            expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
        });
      
        res.status(200).json({
            status: "success",
            message: "Logged in successfully",
            token,
            role: user.role
        });
    }catch(error){
        next(error)
    }
}


export const logout = (req, res, next) => {
    try {
        if (!req.cookies || !req.cookies["jwt-token"]) {
            return res.status(400).json({
                status: "fail",
                message: "No active session found",
            });
        }

        res.clearCookie("jwt-token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production", 
            sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
        });

        return res.status(200).json({
            status: "success",
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error); 
    }
};
