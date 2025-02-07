"use client";

import { Attempt } from "@/types";
import { attemptQuiz } from "@/api";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { FaArrowRotateRight } from "react-icons/fa6";
import React, { use, useEffect, useState } from "react";

const ShowStartPractice = ({
  params,
}: {
  params: Promise<{ quizid: string }>;
}) => {
  const router = useRouter();
  const { quizid } = use(params);
  const [loading, setLoading] = useState<boolean>(false);
  const [attempt, setAttempt] = useState<Attempt | null>(null);

  useEffect(() => {
    const fetAttemptQuiz = async () => {
      setLoading(true);
      try {
        const res = await attemptQuiz(quizid);
        if (res.data.success) {
          setAttempt(res.data.attempt);
          if (res.data.existing && res.data.attempt.completed) {
            console.log("completed"); // pending route to analytics
          }
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetAttemptQuiz();
  }, []);

  const handleClick = () => {
    router.replace(`/practice/${quizid}/attempt/${attempt?.id}`);
  };

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <img src="/test.svg" alt="test logo" className="w-40 h-auto" />
        <div className="mt-3 flex items-center justify-center gap-3 text-2xl">
          <FaArrowRotateRight className="animate-spin" />
          <p>Preparing your test!!</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-auto p-10 pt-2">
      <div className="flex items-center justify-center gap-2 px-2 py-1 bg-zinc-50 border border-gray-100 rounded-lg">
        <img src="/logo.svg" alt="app logo" className="w-12 h-12" />
        <p className="text-3xl font-semibold font-sans">Quizlytic</p>
      </div>
      <h1 className="capitalize text-xl font-sans font-semibold mt-6">
        {attempt?.quiz?.title} : {attempt?.quiz?.quiz_type}
      </h1>
      <div className="w-full px-10 h-auto mt-4">
        <h1 className="text-lg font-bold text-blue-600 mb-4">
          Test Instructions
        </h1>
        <ul className="list-decimal list-inside text-gray-700">
          <li>
            The test will be conducted online on the <strong>Quizlytics</strong>{" "}
            platform.
          </li>
          <li>
            Each quiz consists of a set number of questions, displayed at the
            start of the test.
          </li>
          <li>
            You will have a limited time to complete the quiz, with a visible
            countdown timer.
          </li>
          <li>
            <strong>Scoring System:</strong>
            <ul className="list-disc list-inside ml-4">
              <li>
                Multiple Choice Questions (MCQ) may have{" "}
                <strong>negative marking</strong> for incorrect answers.
              </li>
              <li>
                Multiple Select Questions (MSQ) and Numerical Answer Type (NAT)
                questions <strong>do not</strong> have negative marking.
              </li>
            </ul>
          </li>
          <li>
            You can <strong>navigate between questions</strong> using the
            question palette. Switching questions will not automatically save
            your answer.
          </li>
          <li>
            <strong>Answering a Question:</strong>
            <ul className="list-disc list-inside ml-4">
              <li>
                <strong>For MCQs:</strong> Select one option and click{" "}
                <strong>Save & Next</strong> to lock your answer.
              </li>
              <li>
                <strong>For MSQs:</strong> Select multiple options. Click on an
                option again to deselect it. Click <strong>Save & Next</strong>{" "}
                to confirm.
              </li>
              <li>
                <strong>For NAT Questions:</strong> Enter your answer using the
                keyboard and click <strong>Save & Next</strong> to confirm.
              </li>
            </ul>
          </li>
          <li>
            You can <strong>mark a question for review</strong> if you wish to
            revisit it before submitting.
          </li>
          <li>
            Once you <strong>submit the test</strong>, you can view your score
            and performance analysis.
          </li>
          <li>
            You can <strong>reattempt the quiz</strong> multiple times until the
            test session expires.
          </li>
        </ul>
        <h2 className="text-lg font-semibold text-gray-800 mt-6">
          Important Notes:
        </h2>
        <ul className="list-disc list-inside text-gray-700 mt-2">
          <li>✔ Ensure a stable internet connection to avoid interruptions.</li>
          <li>✔ Do not refresh or leave the quiz window during an attempt.</li>
          <li>
            ✔ Your answers will be auto-saved periodically, but clicking{" "}
            <strong>Save & Next</strong> is recommended.
          </li>
        </ul>
        <p className="text-center text-sm font-semibold text-green-600 mt-6">
          Good luck with your quiz on <strong>Quizlytics</strong>! 🚀
        </p>
      </div>
      <div className="w-full flex items-center justify-center mt-6">
        <Button className="w-[20%]" onClick={handleClick}>
          Start quiz
        </Button>
      </div>
    </div>
  );
};

export default ShowStartPractice;
