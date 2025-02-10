import express from "express"
import { registration, login, logout } from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";

const router = express.Router();


router.post('/register', registration);
router.post("/login", login);
router.post('/logout', authenticateUser, logout);
 

export default router;