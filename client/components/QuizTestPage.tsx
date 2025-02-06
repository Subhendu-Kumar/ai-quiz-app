"use client";

import React, { use } from "react";

const QuizTestPage = ({
  params,
}: {
  params: Promise<{ quizid: string; attemptid: string }>;
}) => {
  const { quizid, attemptid } = use(params);
  console.log("quizId: ", quizid);
  console.log("attemptId: ", attemptid);
  return <div>QuizTestPage</div>;
};

export default QuizTestPage;
