import express from "express";
import { isAuthenticated } from "../middlleware/auth.js";
import { getCourses, getReviews,getQuestions,addReplies,addQuestions, addReview, videoHistory,addingVideoCompleteHistory } from "../controllers/courseControllers.js";

const courseRouter = express.Router();
courseRouter.get("/get-courses",getCourses);
courseRouter.get("/get-reviews/:courseId",getReviews);
courseRouter.get("/get-questions/:contentId",getQuestions);
courseRouter.put("/adding-reply",isAuthenticated,addReplies);
courseRouter.post("/adding-qa",isAuthenticated,addQuestions);
courseRouter.post("/add-review",isAuthenticated,addReview);
courseRouter.get("/video-complete-history",isAuthenticated,videoHistory);
courseRouter.post("/add-video-complete-history",isAuthenticated,addingVideoCompleteHistory);

export default courseRouter;