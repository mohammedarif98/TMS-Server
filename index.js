import express from "express";
import dotenv from 'dotenv';
import connectDB from "./config/dbConnect.js";
import logger from 'morgan';
import helmet from "helmet"
import cors from 'cors'
import globalErrorHandler from "./utils/errorHandler.js";
import authRoutes from './routes/authRoutes.js'
import cookieParser from 'cookie-parser';

// Load env variables
dotenv.config();

// Database Connection
connectDB();

const  app = express();

// Middleware setup
app.use(logger('dev'));
app.use(helmet());
app.use(cors({ 
    origin: process.env.CLIENT_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true 
}));
app.use(cookieParser());
app.use(express.json({limit: "10mb"}));  
app.use(express.urlencoded({ extended: true }));

// api Routes
app.use('/api/auth', authRoutes)

// global Error Handling midleware 
app.use(globalErrorHandler);


// start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`server running on port: ${PORT}`);
})


export default app;