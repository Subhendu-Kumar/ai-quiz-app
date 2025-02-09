import {
  signIn,
  signUp,
  attemptQuiz,
  getAnalytics,
  getQuizeById,
  submitResponse,
  getRecentQuizes,
  createQuizWithAi,
  getRecentQuizesMe,
  getQuizByAttemptId,
  getAllQuizesPaginated,
  getAnalyticsByAttemptId,
} from "../controllers/controllers";
import { Router } from "express";
import verifyToken from "../services/verify_token";

const router: Router = Router();

/*---------- auth routes ----------*/
router.post("/auth/signup", signUp);
router.post("/auth/signin", signIn);

/*---------- all post routes ----------*/
router.post("/create/quiz/ai", verifyToken, createQuizWithAi);
router.post("/quiz/attempt/:quizId", verifyToken, attemptQuiz);
router.post("/quiz/submit/:attemptId", verifyToken, submitResponse);

/*---------- all get routes ----------*/
router.get("/quiz/recent", verifyToken, getRecentQuizes);
router.get("/quiz/recent/me", verifyToken, getRecentQuizesMe);
router.get("/quiz/list/:page", verifyToken, getAllQuizesPaginated);
router.get("/quiz/:quizId", verifyToken, getQuizeById);
router.get("/get/quiz/:attemptId", verifyToken, getQuizByAttemptId);

router.get("/quiz/analytics/my", verifyToken, getAnalytics);
router.get("/quiz/analytics/:attemptId", verifyToken, getAnalyticsByAttemptId);

export default router;
