import express from "express";
import dotenv from 'dotenv';
import connectDB from "./config/dbConnect.js";
import logger from 'morgan';
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

const allowedOrigins = [
    "http://localhost:3000", 
    "https://tms-client-gdonavnt0-mohammed-arifs-projects-aa619f26.vercel.app"
];

app.use(cors({
    origin: allowedOrigins, 
    credentials: true, 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
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