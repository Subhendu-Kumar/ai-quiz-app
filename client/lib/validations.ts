import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email("Invalid email address"),
  avatar: z.string().url("Invalid avatar URL").optional(),
  role: z.enum(["USER", "CREATOR"], { message: "Role is required" }),
  username: z.string().min(3, "Username must be at least 3 characters long"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const signInSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters long"),
});

export const quizSchema = z.object({
  title: z.string().min(1, "Title is required"),
  topic: z.string().min(1, "Topic is required"),
  description: z.string().min(1, "Description is required"),
  quiztype: z.enum(["MULTIPLE_CHOICE", "TRUE_FALSE"], {
    errorMap: () => ({ message: "Invalid quiz type" }),
  }),
  difficultylevel: z.enum(["EASY", "MEDIUM", "HARD"], {
    errorMap: () => ({ message: "Invalid difficulty level" }),
  }),
  numberofquestions: z
    .number()
    .min(1, "Must be at least 1 question")
    .max(30, "Maximum 30 questions allowed"),
});
