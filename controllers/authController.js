import Auth from "../models/authModel.js";
import HttpError from "../utils/HttpError.js";
import { generateToken } from "../utils/jwt.js";



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

        const { password: _, ...userData } = user.toObject();

        return res.status(201).json({
            status: "success",
            message: "User registered successfully",
            user: userData
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
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
            // domain: process.env.NODE_ENV === "production" ? ".yourdomain.com" : undefined
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
        res.clearCookie("jwt-token", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "Lax",
        });

        res.status(200).json({
            status: "success",
            message: "Logged out successfully",
        });
    } catch (error) {
        next(error);
    }
};
