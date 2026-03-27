import express from "express";
import { isAuthenticated } from "../middlleware/auth.js";
import { updatePushToken } from "../controllers/notificationControllers.js";


const notificationRoutes = express.Router();
notificationRoutes.put('/update-push-token', isAuthenticated,updatePushToken);

export default notificationRoutes;