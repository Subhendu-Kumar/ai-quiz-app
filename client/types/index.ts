import { signInSchema, signUpSchema } from "@/lib/validations";
import { z } from "zod";

export type SignupFormData = z.infer<typeof signUpSchema>;

export type SignInFormData = z.infer<typeof signInSchema>;
