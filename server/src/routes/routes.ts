import {
  signIn,
  signUp,
  getAllQuizesPaginated,
  createQuizWithAi,
} from "../controllers/controllers";
import { Router } from "express";
import verifyToken from "../services/verify_token";

const router: Router = Router();

// Define all routes here
router.post("/auth/signup", signUp);
router.post("/auth/signin", signIn);

router.post("/create/quiz/ai", verifyToken, createQuizWithAi);
router.get("/quiz/list/:page", verifyToken, getAllQuizesPaginated);

export default router;
