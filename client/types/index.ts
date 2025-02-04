import { signInSchema, signUpSchema } from "@/lib/validations";
import { z } from "zod";

export interface AuthContextProps {
  isAuthenticated: boolean;
  loading: boolean;
  login: (token: string, userData: User) => void;
  logout: () => void;
}

export type SignupFormData = z.infer<typeof signUpSchema>;

export type SignInFormData = z.infer<typeof signInSchema>;

type Role = "USER" | "CREATOR";

export interface User {
  id: string;
  role: Role;
  email: string;
  avatar: string;
  username: string;
}
