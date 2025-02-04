import { SignInFormData, SignupFormData } from "@/types";
import axios from "axios";

const BASE_URL = `${process.env.NEXT_PUBLIC_BASE_BACKEND_URL}`;

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
