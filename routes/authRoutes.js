import express from "express"
import { registration, login, logout, getProfile, getAllUsers } from "../controllers/authController.js";
import { authenticateUser } from "../middlewares/authMiddleware.js";
import { authorizeRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();


router.post('/register', registration);
router.post("/login", login);
router.post('/logout', authenticateUser, logout);

// // Protected routes (require authentication)
// router.use(authenticateUser);

// User-only routes
router.get("/user/profile",authenticateUser, authorizeRoles("user"), getProfile);

// Admin-only routes
router.get("/admin/get-users",authenticateUser, authorizeRoles("admin"), getAllUsers);


export default router;