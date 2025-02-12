import axios from "axios";
import bcrypt from "bcryptjs";
import { Response, Request } from "express";
import { createToken } from "../services/create_token";
import { PrismaClient, QuestionType } from "@prisma/client";
import { ApiResponse, QuizQuestion } from "../types/index";
import { parseEscapedJsonString } from "../services/parse_json_string";

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
  const LIMIT = 9;
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
      include: {
        creator: {
          select: {
            email: true,
            username: true,
            avatar: true,
            role: true,
            id: true,
          },
        },
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

export const getRecentQuizes = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const quizes = await prisma.quiz.findMany({
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
      include: {
        creator: {
          select: {
            email: true,
            username: true,
            avatar: true,
            role: true,
            id: true,
          },
        },
      },
    });
    if (!quizes || quizes.length === 0) {
      res.json({ success: false, message: "No quizes found!!!" });
      return;
    }
    res.json({ success: true, message: "quiz retrived successfully!", quizes });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export const getRecentQuizesMe = async (
  req: Request,
  res: Response
): Promise<void> => {
  const user = (req as any).user;
  if (user.role !== "CREATOR") {
    res.json({ success: false, message: "you are not an creator" });
    return;
  }
  try {
    const quizes = await prisma.quiz.findMany({
      where: {
        creatorId: user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 8,
      include: {
        creator: {
          select: {
            email: true,
            username: true,
            avatar: true,
            role: true,
            id: true,
          },
        },
      },
    });
    if (!quizes || quizes.length === 0) {
      res.json({ success: false, message: "No quizes found!!!" });
      return;
    }
    res.json({ success: true, message: "quiz retrived successfully!", quizes });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export const getQuizeById = async (
  req: Request<{ quizId: string }>,
  res: Response
): Promise<void> => {
  const { quizId } = req.params;
  if (!quizId) {
    res.json({ success: false, message: "quiz id not provided!!" });
    return;
  }
  try {
    const quiz = await prisma.quiz.findUnique({
      where: {
        id: quizId,
      },
      include: {
        questions: true,
      },
    });
    if (!quiz) {
      res.json({ success: false, message: "quiz not found with this id!!" });
      return;
    }
    res.json({ success: true, message: "quiz fetched successfully", quiz });
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export const getQuizByAttemptId = async (
  req: Request<{ attemptId: string }>,
  res: Response
): Promise<void> => {
  const { attemptId } = req.params;
  const { id: userId } = (req as any).user;
  if (!attemptId) {
    res.json({ success: false, message: "attempt id not provided!!" });
    return;
  }
  try {
    const existingAttempt = await prisma.quizAttempt.findFirst({
      where: {
        AND: [{ id: attemptId }, { userId }],
      },
      include: {
        quiz: {
          include: {
            questions: true,
          },
        },
      },
    });
    if (!existingAttempt) {
      res.json({
        success: false,
        message: "quiz attempt not found!",
      });
      return;
    }
    res.json({
      success: true,
      message: "attempt fetched successfully!",
      attempt: existingAttempt,
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

export const attemptQuiz = async (
  req: Request<{ quizId: string }>,
  res: Response
): Promise<void> => {
  const { quizId } = req.params;
  const { id: userId } = (req as any).user;
  if (!quizId) {
    res.json({ success: false, message: "quiz id not provided!!" });
    return;
  }
  try {
    const existingAttempt = await prisma.quizAttempt.findFirst({
      where: {
        AND: [{ quizId }, { userId }],
      },
      select: {
        id: true,
        userId: true,
        quiz: true,
        score: true,
        completed: true,
        attemptedAt: true,
        updatedAt: true,
      },
    });
    if (existingAttempt) {
      res.json({
        success: true,
        existing: true,
        message: "quiz attempted previously!",
        attempt: existingAttempt,
      });
      return;
    } else {
      const newAttempt = await prisma.quizAttempt.create({
        data: {
          quizId,
          userId,
        },
        select: {
          id: true,
          userId: true,
          quiz: true,
          score: true,
          completed: true,
          attemptedAt: true,
          updatedAt: true,
        },
      });
      res.json({
        success: true,
        existing: false,
        message: "quiz attempt created",
        attempt: newAttempt,
      });
    }
  } catch (error) {
    console.error(error);
    res.json({
      success: false,
      message: "Internal server error",
      error,
    });
  }
};

export const submitResponse = async (
  req: Request<{ attemptId: string }>,
  res: Response
): Promise<void> => {
  try {
    const { attemptId } = req.params;
    const { answers } = req.body;
    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      res.json({ success: false, message: "Invalid or empty answers array" });
      return;
    }
    const attempt = await prisma.quizAttempt.findUnique({
      where: { id: attemptId },
      include: { quiz: { include: { questions: true } } },
    });
    if (!attempt) {
      res.json({ success: false, message: "Quiz attempt not found" });
      return;
    }
    if (attempt.completed) {
      res.json({ success: false, message: "already submitted response!" });
      return;
    }
    const questionMap = new Map(
      attempt.quiz.questions.map((q) => [q.id, q.answer])
    );
    let score = 0;
    const responses = answers.map(({ questionId, selectedOption }) => {
      const correctOption = questionMap.get(questionId);
      if (correctOption === selectedOption) {
        score++;
      }
      return {
        attemptId,
        questionId,
        selectedOption,
      };
    });
    await prisma.response.createMany({ data: responses });
    await prisma.quizAttempt.update({
      where: { id: attemptId },
      data: { score, completed: true },
    });
    res.json({
      success: true,
      message: "Responses submitted successfully",
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

export const getAnalyticsByAttemptId = async (
  req: Request<{ attemptId: string }>,
  res: Response
): Promise<void> => {
  const { attemptId } = req.params;
  const { id: userId } = (req as any).user;
  if (!attemptId) {
    res.json({ success: false, message: "quiz id not provided!!" });
    return;
  }
  try {
    const existingAttempt = await prisma.quizAttempt.findFirst({
      where: {
        AND: [{ id: attemptId }, { userId }],
      },
      include: {
        responses: true,
        quiz: {
          include: {
            questions: true,
          },
        },
      },
    });
    if (!existingAttempt) {
      res.json({
        success: false,
        message: "quiz attempt not found for the user",
      });
      return;
    }
    if (!existingAttempt.completed) {
      res.json({ success: false, message: "quiz attempt is not completed" });
      return;
    }
    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        AND: [{ id: attemptId }, { userId }],
      },
      include: {
        quiz: true,
      },
    });
    const { quiz, responses } = existingAttempt;
    const totalNoOfQuestions = quiz.questions.length;
    const noOfQuestionsAttempted = responses.length;
    const percentageComplete =
      (noOfQuestionsAttempted / totalNoOfQuestions) * 100;
    const securedMark = existingAttempt.score;
    const incorrectAns = noOfQuestionsAttempted - securedMark;
    const noOfQuestionsSkipped = totalNoOfQuestions - noOfQuestionsAttempted;
    const accuracy =
      noOfQuestionsAttempted > 0
        ? (securedMark / noOfQuestionsAttempted) * 100
        : 0;
    res.json({
      success: true,
      message: "Successfully fetched analytics",
      totalNoOfQuestions,
      noOfQuestionsAttempted,
      securedMark,
      incorrectAns,
      noOfQuestionsSkipped,
      accuracy: accuracy.toFixed(2),
      percentageComplete: percentageComplete.toFixed(2),
      attempt,
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

export const getAnalytics = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: userId } = (req as any).user;
  try {
    const existingAttempt = await prisma.quizAttempt.findMany({
      where: {
        userId,
      },
      include: {
        quiz: {
          include: {
            questions: true,
          },
        },
        responses: true,
      },
    });
    if (!existingAttempt || existingAttempt.length === 0) {
      res.json({
        success: false,
        message: "no attempted quiz found for this user!",
      });
      return;
    }
    const totalQuizAttempted = existingAttempt.length;
    let totalSecuredMarks = 0;
    let totalQuestions = 0;
    let totalAttemptedQuestions = 0;
    let highestScoreOfAll = 0;
    existingAttempt.forEach((attempt) => {
      if (highestScoreOfAll < attempt.score) {
        highestScoreOfAll = attempt.score;
      }
      totalSecuredMarks += attempt.score;
      totalQuestions += attempt.quiz.questions.length;
      totalAttemptedQuestions += attempt.responses.length;
    });
    const totalSkippedQuestions = totalQuestions - totalAttemptedQuestions;
    const totalAccuracy =
      totalAttemptedQuestions > 0
        ? (totalSecuredMarks / totalAttemptedQuestions) * 100
        : 0;
    const totalMarksLost = totalAttemptedQuestions - totalSecuredMarks;
    const averageScorePerQuizAttempt =
      totalQuizAttempted > 0 ? totalSecuredMarks / totalQuizAttempted : 0;
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
        avatar: true,
        username: true,
      },
    });
    const date = new Date();
    res.json({
      user,
      date,
      success: true,
      totalAccuracy,
      totalQuestions,
      totalMarksLost,
      highestScoreOfAll,
      totalSecuredMarks,
      totalQuizAttempted,
      totalSkippedQuestions,
      totalAttemptedQuestions,
      averageScorePerQuizAttempt,
      message: "analytics fetched scuccessfully!!",
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
