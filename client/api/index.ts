import { getToken } from "@/lib/utils";
import { Ans, QuizSchema, SignInFormData, SignupFormData } from "@/types";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}`;

const API = axios.create({
  baseURL: BASE_URL,
});

API.interceptors.request.use((req) => {
  const token = getToken();
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

/*---------- auth services ----------*/
export const signUp = async (data: SignupFormData) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/signup`, data);
    return res;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const signIn = async (data: SignInFormData) => {
  try {
    const res = await axios.post(`${BASE_URL}/auth/signin`, data);
    return res;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const quizFetchRecent = async () => {
  try {
    const res = await API.get("/quiz/recent");
    return res;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const quizFetchRecentMe = async () => {
  try {
    const res = await API.get("/quiz/recent/me");
    return res;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const generateQuiz = async (data: QuizSchema) => {
  try {
    const res = await API.post("/create/quiz/ai", data);
    return res;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const getPaginatedQuiz = async (page: number) => {
  try {
    const res = await API.get(`/quiz/list/${page.toString()}`);
    return res;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const attemptQuiz = async (quizId: string) => {
  try {
    const res = await API.post(`/quiz/attempt/${quizId}`);
    return res;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const getQuizByAttemptId = async (attemptId: string) => {
  try {
    const res = await API.get(`/get/quiz/${attemptId}`);
    return res;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};

export const submitQuizTest = async (attemptId: string, answers: Ans[]) => {
  console.log(answers)
  try {
    const res = await API.post(`/quiz/submit/${attemptId}`, {answers});
    return res;
  } catch (error) {
    throw new Error(error instanceof Error ? error.message : String(error));
  }
};
