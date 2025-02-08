import { quizSchema, signInSchema, signUpSchema } from "@/lib/validations";
import { z } from "zod";

export interface AuthContextProps {
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

export type SignupFormData = z.infer<typeof signUpSchema>;

export type SignInFormData = z.infer<typeof signInSchema>;

export type QuizSchema = z.infer<typeof quizSchema>;

type Role = "USER" | "CREATOR";

export interface User {
  id: string;
  role: Role;
  email: string;
  avatar: string;
  username: string;
}

export interface Quiz {
  id: string;
  title: string;
  description: string;
  quiz_type: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  creator?: User;
}

export interface Attempt {
  id: string;
  userId: string;
  quiz: Quiz;
  score: number;
  completed: boolean;
  attemptedAt: string;
  updatedAt: string;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  completed: boolean;
  attemptedAt: string;
  updatedAt: string;
  quiz: Quiz2;
}

interface Quiz2 {
  id: string;
  title: string;
  description: string;
  quiz_type: "TRUE_FALSE" | "MULTIPLE_CHOICE";
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  questions: Question[];
}

interface Question {
  id: string;
  quizId: string;
  text: string;
  type: "TRUE_FALSE" | "MULTIPLE_CHOICE";
  options: string[];
  answer: number;
  createdAt: string;
  updatedAt: string;
}

export interface Ans {
  questionId: string;
  selectedOption: number;
}
