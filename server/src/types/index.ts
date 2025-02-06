type Role = "USER" | "CREATOR";

export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  role: Role;
}

export interface ApiResponse {
  success: boolean;
  statusCode: number;
  request: {
    ip: string | null;
    method: string;
    url: string;
  };
  message: string;
  data: {
    id: string;
    model: string;
    content: string;
    usage: {
      promptTokens: number;
      completionTokens: number;
      totalTokens: number;
    };
    cost: number;
  };
}

export interface QuizQuestion {
  question: string;
  options: string[];
  answer: number;
  difficulty: "easy" | "medium" | "hard";
  type: "true/false" | "multiple choice";
}
