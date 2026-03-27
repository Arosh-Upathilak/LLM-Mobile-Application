import express from "express";
import { login,myDetails} from "../controllers/userControllers.js";
import { isAuthenticated } from "../middlleware/auth.js";

const userRouter = express.Router();
userRouter.post('/login',login);
userRouter.get('/me',isAuthenticated,myDetails);

export default  userRouter;