import { User } from "@/types";
import { jwtDecode } from "jwt-decode";
import { twMerge } from "tailwind-merge";
import { clsx, type ClassValue } from "clsx";
import { TOKEN_KEY, USER_DETAILS_KEY } from "@/config";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const setUserDetails = (data: User): void => {
  localStorage.setItem(USER_DETAILS_KEY, JSON.stringify(data));
};

export const getUserDetails = (): User | null => {
  const userDetails = localStorage.getItem(USER_DETAILS_KEY);
  if (userDetails) {
    return JSON.parse(userDetails);
  }
  return null;
};

export const setToken = (token: string): void => {
  localStorage.setItem(TOKEN_KEY, token);
};

export const getToken = (): string | null => {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    try {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;
      if (decodedToken.exp && decodedToken.exp < currentTime) {
        clearUserData();
        return null;
      }
      return token;
    } catch (error) {
      console.log(error);
      clearUserData();
      return null;
    }
  }
  return null;
};

export const clearUserData = (): void => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_DETAILS_KEY);
};
