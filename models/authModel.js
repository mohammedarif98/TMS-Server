import mongoose from 'mongoose';
import bcrypt from "bcryptjs";


const authSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    role: {
        type: String,
        enum: ["user", "admin"],
        default: "user",
    },
    password: {
        type: String,
        required: true,
        select: false    
    },
    isBlocked: {
        type: Boolean,
        default: false
    } 
},
{ timestamps: true }
);


// Hash password before saving
authSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, Number(process.env.BCRYPT_SALT_ROUNDS));
    next();
  });
  
// Compare password
authSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
  };


const Auth = mongoose.model("Auth", authSchema);
export default Auth;