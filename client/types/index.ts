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
