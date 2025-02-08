import { z } from "zod";
import { IconType } from "react-icons";
import { quizSchema, signInSchema, signUpSchema } from "@/lib/validations";

export interface AuthContextProps {
  loading: boolean;
  logout: () => void;
  isAuthenticated: boolean;
  login: (token: string, userData: User) => void;
}

type Role = "USER" | "CREATOR";
export type QuizSchema = z.infer<typeof quizSchema>;
export type SignupFormData = z.infer<typeof signUpSchema>;
export type SignInFormData = z.infer<typeof signInSchema>;

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
  creator?: User;
  quiz_type: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  description: string;
}

export interface Attempt {
  id: string;
  quiz: Quiz;
  score: number;
  userId: string;
  updatedAt: string;
  completed: boolean;
  attemptedAt: string;
}

export interface QuizAttempt {
  id: string;
  quiz: Quiz2;
  score: number;
  quizId: string;
  userId: string;
  updatedAt: string;
  completed: boolean;
  attemptedAt: string;
}

interface Quiz2 {
  id: string;
  title: string;
  creatorId: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  questions: Question[];
  quiz_type: "TRUE_FALSE" | "MULTIPLE_CHOICE";
}

interface Question {
  id: string;
  text: string;
  quizId: string;
  answer: number;
  options: string[];
  createdAt: string;
  updatedAt: string;
  type: "TRUE_FALSE" | "MULTIPLE_CHOICE";
}

export interface Ans {
  questionId: string;
  selectedOption: number;
}

export interface AnalyticsQuiz {
  message: string;
  accuracy: string;
  success: boolean;
  securedMark: number;
  incorrectAns: number;
  attempt: QuizAttempt2;
  totalNoOfQuestions: number;
  percentageComplete: string;
  noOfQuestionsSkipped: number;
  noOfQuestionsAttempted: number;
}

interface QuizAttempt2 {
  id: string;
  score: number;
  quizId: string;
  userId: string;
  updatedAt: string;
  completed: boolean;
  attemptedAt: string;
  quiz: {
    id: string;
    title: string;
    creatorId: string;
    createdAt: string;
    updatedAt: string;
    description: string;
    quiz_type: "TRUE_FALSE" | "MULTIPLE_CHOICE";
  };
}

export interface StatsData {
  text: string;
  color: string;
  total?: number;
  icon: IconType;
  subText?: string;
  obtained?: number;
  accuracy?: string;
  percentage?: number;
}
