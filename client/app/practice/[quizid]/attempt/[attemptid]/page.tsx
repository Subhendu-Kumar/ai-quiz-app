import React from "react";
import QuizTestPage from "@/components/QuizTestPage";

const AtemptQuiz = ({
  params,
}: {
  params: Promise<{ quizid: string; attemptid: string }>;
}) => {
  return <QuizTestPage params={params} />;
};

export default AtemptQuiz;
