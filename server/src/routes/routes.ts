import {
  signIn,
  signUp,
  attemptQuiz,
  getQuizeById,
  submitResponse,
  getRecentQuizes,
  createQuizWithAi,
  getAllQuizesPaginated,
  getAnalyticsByQuizId,
} from "../controllers/controllers";
import { Router } from "express";
import verifyToken from "../services/verify_token";

const router: Router = Router();

// Define all routes here
router.post("/auth/signup", signUp);
router.post("/auth/signin", signIn);

router.post("/create/quiz/ai", verifyToken, createQuizWithAi);
router.get("/quiz/list/:page", verifyToken, getAllQuizesPaginated);
router.get("/quiz/recent", verifyToken, getRecentQuizes);
router.get("/quiz/:quizId", verifyToken, getQuizeById);
router.post("/quiz/attempt/:quizId", verifyToken, attemptQuiz);
router.post("/quiz/submit/:attemptId", verifyToken, submitResponse);
router.get("/quiz/analytics/:quizId", verifyToken, getAnalyticsByQuizId)

export default router;
