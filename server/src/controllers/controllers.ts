import axios from "axios";
import bcrypt from "bcryptjs";
import { Response, Request } from "express";
import { createToken } from "../services/create_token.ts";
import { PrismaClient, QuestionType } from "@prisma/client";
import { ApiResponse, QuizQuestion } from "../types/index.ts";
import { parseEscapedJsonString } from "../services/parse_json_string.ts";

const prisma = new PrismaClient();

export const signUp = async (req: Request, res: Response): Promise<void> => {
  const { email, username, password, avatar, role } = req.body;
  if (!email || !username || !password || !role) {
    res.json({
      success: false,
      message: "please fill all the details!!!",
    });
    return;
  }
  try {
    const existinguser = await prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (existinguser) {
      res.json({
        success: false,
        message: "User already exists",
      });
      return;
    }
    const hashedPassword = await bcrypt.hash(password, 12);
    await prisma.user.create({
      data: {
        role,
        email,
        avatar,
        username,
        password: hashedPassword,
      },
    });
    res.json({
      success: true,
      message: "User created successfully",
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export const signIn = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.json({
      success: false,
      message: "please fill all the credentials!!",
    });
    return;
  }
  try {
    const existinguser = await prisma.user.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        role: true,
        email: true,
        avatar: true,
        username: true,
        password: true,
      },
    });
    if (!existinguser) {
      res.json({
        success: false,
        message: "User doesn't exists",
      });
      return;
    }
    const isPasswordCorrect = await bcrypt.compare(
      password,
      existinguser?.password
    );
    if (!isPasswordCorrect) {
      res.json({ success: false, message: "Invalid credentials" });
      return;
    }
    const { password: _, ...userWithoutPassword } = existinguser;
    const token = createToken(userWithoutPassword);
    res.json({
      success: true,
      message: "User signed in successfully",
      token,
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export const createQuizWithAi = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id, role } = (req as any).user;
  if (role !== "CREATOR") {
    res.json({
      success: false,
      message:
        "you are not a creator so you don't have access to create an quiz!!",
    });
    return;
  }
  const {
    title,
    topic,
    quiztype,
    description,
    difficultylevel,
    numberofquestions,
  } = req.body;
  if (!title || !description || !topic) {
    res.json({
      success: false,
      message: "please fill title, description, and topic !!!",
    });
    return;
  }
  const api_key = process.env.API_KEY;
  if (!api_key) {
    res.json({ success: false, message: "server error" });
    return;
  }
  const api_url = process.env.API_URL;
  if (!api_url) {
    res.json({ success: false, message: "server error" });
    return;
  }
  const prompt = `Generate a ${title} quiz in JSON format. The quiz should include ${
    numberofquestions || 10
  } questions on the topic ${topic} with a difficulty level of ${
    difficultylevel || "easy"
  } with quiz type of only ${
    quiztype || "multiple choice"
  }. Each question should have a type field indicating whether it's multiple choice or true/false. If the type is multiple choice, provide an options array with four choices and an answer field containing the index (0-3) of the correct option. If the type is true/false, provide an options array with ['True', 'False'] and an answer field with the index (0 for True, 1 for False). The response should be a JSON array with no extra text, containing objects in the following format: [{'question':'demo question','options':['demo option 1','demo option 2','demo option 3','demo option 4'],'answer': index of ans array in number, 'difficulty':'easy/medium/hard', 'type':'multiple_choice / true_false'}].`;
  const requestBody = {
    prompt,
    stream: false,
    config: {
      temperature: 0.7,
      maxOutputTokens: 4096,
      topP: 1,
      topK: 40,
    },
  };
  const headers = {
    "Content-Type": "application/json",
    "X-Api-Key": api_key,
  };
  try {
    const response = await axios.post<ApiResponse>(api_url, requestBody, {
      headers,
    });
    if (response.status !== 200) {
      res.json({ success: false, message: "api error in server!!" });
      return;
    }
    const result: ApiResponse = response.data;
    const questions: QuizQuestion[] = parseEscapedJsonString(
      result.data.content
    );
    const formattedQuestions = questions.map((q: any) => ({
      text: q.question,
      type: q.type.toUpperCase() as QuestionType,
      options: q.options,
      answer: q.answer,
    }));
    await prisma.quiz.create({
      data: {
        title,
        description,
        quiz_type: quiztype,
        creatorId: id,
        questions: {
          create: formattedQuestions,
        },
      },
    });
    res.json({ success: true, message: "quiz created successfully" });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export const getAllQuizesPaginated = async (
  req: Request<{ page: string }>,
  res: Response
): Promise<void> => {
  const { page = "1" } = req.params;
  const LIMIT = 11;
  const currentPage = Number(page);
  if (isNaN(currentPage) || currentPage < 1) {
    res.json({ success: false, message: "Invalid page number" });
    return;
  }
  const startIndex = (currentPage - 1) * LIMIT;
  try {
    const total = await prisma.quiz.count();
    const quizes = await prisma.quiz.findMany({
      orderBy: {
        createdAt: "desc",
      },
      skip: startIndex,
      take: LIMIT,
    });
    if (!quizes || quizes.length === 0) {
      res.json({ success: false, message: "No quizes found" });
      return;
    }
    res.json({
      success: true,
      numberOfPages: Math.ceil(total / LIMIT),
      currentPage,
      quizes,
    });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};
