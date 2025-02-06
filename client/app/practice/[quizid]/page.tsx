import React from "react";
import ShowStartPractice from "@/components/ShowStartPractice";

const StartPractice = ({ params }: { params: Promise<{ quizid: string }> }) => {
  return <ShowStartPractice params={params} />;
};

export default StartPractice;
