import { QuizQuestion } from "../types";

export const parseEscapedJsonString = (escapedJsonString: string): QuizQuestion[]=> {
  try {
    const validJsonString = escapedJsonString
      .replace(/\\n/g, "")
      .replace(/\\"/g, '"');
    return JSON.parse(validJsonString) as QuizQuestion[];
  } catch (error) {
    console.error("Error parsing JSON:", error);
    return [];
  }
};
