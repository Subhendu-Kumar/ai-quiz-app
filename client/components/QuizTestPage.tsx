"use client";

import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from "./ui/alert-dialog";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
import { Ans, QuizAttempt } from "@/types";
import { useToast } from "@/hooks/use-toast";
import { useFullscreen } from "@/lib/useFullscreen";
import AlertDialogLoader from "./AlertDialogLoader";
import { FaArrowRotateRight } from "react-icons/fa6";
import React, { use, useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { getQuizByAttemptId, submitQuizTest } from "@/api";

const QuizTestPage = ({
  params,
}: {
  params: Promise<{ quizid: string; attemptid: string }>;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { attemptid } = use(params);
  const [answered, setAnswered] = useState<number>(0);
  const [answers, setAnswers] = useState<Ans[] | []>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [notAnswered, setNotAnswered] = useState<number>(0);
  const [submittingAns, setSubmittingAns] = useState<boolean>(false);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [questionPresentIndex, setQuestionPresentIndex] = useState<number>(0);
  const [questionsTotalIndexes, setQuestionsTotalIndexes] = useState<number>(0);

  const { enterFullscreen, exitFullscreen } = useFullscreen();
  const pathname = usePathname();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      if (!document.fullscreenElement) {
        setShowModal(true);
      }
    };
    const isFullscreenRoute = /^\/practice\/[^/]+\/attempt\/[^/]+$/.test(
      pathname
    );
    if (isFullscreenRoute) {
      enterFullscreen();
      document.addEventListener("fullscreenchange", handleFullscreenChange);
    }
    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      if (!isFullscreenRoute && document.fullscreenElement) {
        exitFullscreen();
      }
    };
  }, [pathname, enterFullscreen, exitFullscreen]);

  const handleStay = () => {
    setShowModal(false);
    enterFullscreen();
  };

  const handleLeave = () => {
    exitFullscreen();
    setShowModal(false);
    router.push("/dashboard");
  };

  useEffect(() => {
    const fetchAttempt = async () => {
      setLoading(true);
      try {
        const res = await getQuizByAttemptId(attemptid);
        if (res?.data?.success) {
          setQuizAttempt(res?.data?.attempt);
          setQuestionsTotalIndexes(res?.data?.attempt?.quiz?.questions?.length);
          setNotAnswered(res?.data?.attempt?.quiz?.questions?.length);
        } else {
          toast({
            title: "Error",
            description: res.data.message,
            variant: "destructive",
          });
          router.push("/dashboard");
        }
      } catch (error) {
        console.log("error fetching quiz by attempt id", error);
        toast({
          title: "Error",
          description: "something went wrong",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAttempt();
  }, []);

  const handleOptionSelect = (optionIndex: number) => {
    setSelectedOption(optionIndex);
  };

  const handleSaveAndNext = () => {
    if (selectedOption === null) {
      return toast({
        title: "Error",
        description:
          "Select an option to save & next otherwise use simply next to navigate",
      });
    }
    const currentQuestion = quizAttempt?.quiz?.questions[questionPresentIndex];
    if (!currentQuestion) return;
    const updatedAnswers = [...answers];
    const existingAnswerIndex = updatedAnswers.findIndex(
      (ans) => ans.questionId === currentQuestion.id
    );
    if (existingAnswerIndex === -1) {
      updatedAnswers.push({
        questionId: currentQuestion.id,
        selectedOption,
      });
      setAnswered((prev) => prev + 1);
      setNotAnswered((prev) => prev - 1);
    } else {
      updatedAnswers[existingAnswerIndex].selectedOption = selectedOption;
    }
    setAnswers(updatedAnswers);
    setSelectedOption(null);
    if (questionPresentIndex < questionsTotalIndexes - 1) {
      setQuestionPresentIndex((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    if (questionPresentIndex < questionsTotalIndexes - 1) {
      setQuestionPresentIndex(questionPresentIndex + 1);
    }
  };

  const handlePrevious = () => {
    if (questionPresentIndex > 0) {
      setQuestionPresentIndex(questionPresentIndex - 1);
    }
  };

  const handleSubmitTest = async () => {
    if (answers.length === 0) {
      return toast({
        title: "Error",
        description: "Atleast ans one question to submit the quiz test!!",
      });
    }
    setSubmittingAns(true);
    try {
      const res = await submitQuizTest(attemptid, answers);
      if (res.data.success) {
        toast({
          title: "Success",
          description: res.data.message,
        });
        router.replace(`/analytics/${attemptid}`);
      } else {
        toast({
          title: "Error",
          description: res.data.message,
          variant: "destructive",
        });
        router.push("/dashboard");
      }
    } catch (error) {
      console.log("error submitting answers", error);
      toast({
        title: "Error",
        description: "something went wrong while submitting answers",
        variant: "destructive",
      });
    } finally {
      setSubmittingAns(false);
    }
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
    <div className="w-full h-screen p-3" id="testpage">
      <AlertDialog open={showModal}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Exit Fullscreen?</AlertDialogTitle>
            <AlertDialogDescription>
              You are currently in fullscreen mode for this practice session. Do
              you want to exit fullscreen?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={handleStay}>Stay</AlertDialogCancel>
            <AlertDialogAction onClick={handleLeave}>Leave</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialogLoader
        title="Submitting answers for the quiz test"
        open={submittingAns}
        onOpenChange={setSubmittingAns}
      />
      <div className="flex w-full h-14 items-center justify-between gap-2 px-2 py-1 bg-zinc-50 border border-gray-100 rounded-lg">
        <div className="flex items-center justify-center gap-2">
          <img src="/logo.svg" alt="app logo" className="w-12 h-12" />
          <p className="text-3xl font-semibold font-sans">Quizlytic</p>
        </div>
        <p className="text-2xl font-semibold font-sans">Test Page</p>
        <div className="flex items-center justify-center gap-3">
          <Button
            onClick={handleSubmitTest}
            className="bg-green-500 hover:bg-green-500/90"
          >
            submit test
          </Button>
          <Button variant="destructive">leave test</Button>
        </div>
      </div>
      <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center pt-3 gap-3">
        <div className="w-[70%] h-full border rounded-lg border-gray-200 overflow-hidden flex items-start justify-start flex-col">
          <div className="w-full h-[90%] p-4">
            {quizAttempt?.quiz?.questions && (
              <>
                <h1 className="font-sans font-semibold text-xl text-wrap">
                  Q{questionPresentIndex + 1}.&#x29;{" "}
                  <span className="text-lg font-sans font-medium text-gray-600">
                    {quizAttempt?.quiz?.questions[questionPresentIndex]?.text}
                  </span>
                </h1>
                <div className="w-full h-auto flex items-start justify-start gap-3 mt-6 flex-col">
                  {quizAttempt?.quiz?.questions[
                    questionPresentIndex
                  ]?.options.map((option, idx) => {
                    const isSelected = answers.some(
                      (ans) =>
                        ans.questionId ===
                          quizAttempt?.quiz?.questions[questionPresentIndex]
                            ?.id && ans.selectedOption === idx
                    );
                    return (
                      <div
                        key={idx}
                        onClick={() => handleOptionSelect(idx)}
                        className="w-full h-auto flex items-center justify-start gap-2"
                      >
                        <Checkbox
                          checked={selectedOption === idx || isSelected}
                        />
                        <p className="text-lg font-sans font-medium">
                          {String.fromCharCode(65 + idx).toUpperCase()}.&#x29;
                        </p>
                        <p className="text-base font-sans font-normal">
                          {option}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          <div className="w-full h-[10%] border-t border-gray-200 rounded-lg px-4 flex items-center gap-3 justify-end">
            {questionPresentIndex > 0 && (
              <Button
                onClick={handlePrevious}
                className="bg-blue-500 hover:bg-blue-500/90 text-lg font-sans font-semibold"
              >
                Previous
              </Button>
            )}
            {questionPresentIndex !== questionsTotalIndexes - 1 && (
              <Button
                onClick={handleNext}
                className="bg-blue-500 hover:bg-blue-500/90 text-lg font-sans font-semibold"
              >
                Next
              </Button>
            )}
            <Button
              onClick={handleSaveAndNext}
              className="bg-green-500 hover:bg-green-500/90 text-lg font-sans font-semibold"
            >
              {questionPresentIndex === questionsTotalIndexes - 1
                ? "Save"
                : "Save & Next"}
            </Button>
          </div>
        </div>
        <div className="w-[30%] h-full p-4 border border-gray-200 rounded-lg overflow-hidden">
          <div className="w-full h-auto p-3 rounded-lg bg-green-50 flex items-start justify-start flex-col gap-3">
            <h1 className="font-sans font-semibold text-base">
              Total no. of Questions: {quizAttempt?.quiz?.questions.length}
            </h1>
            <div className="w-full h-auto grid grid-cols-2 gap-2">
              <div className="w-full h-auto flex items-center justify-start gap-2">
                <div className="w-6 h-6 rounded-sm flex items-center justify-center bg-green-500 text-white">
                  {answered}
                </div>
                <p className="text-base font-sans font-semibold">Answered</p>
              </div>
              <div className="w-full h-auto flex items-center justify-start gap-2">
                <div className="w-6 h-6 rounded-sm flex items-center justify-center bg-red-500 text-white">
                  {notAnswered}
                </div>
                <p className="text-base font-sans font-semibold">
                  Not Answered
                </p>
              </div>
            </div>
          </div>
          <div className="w-full h-auto gap-2 mt-6 grid grid-cols-5">
            {quizAttempt?.quiz?.questions.map((q, idx) => {
              const isAnswred = answers.some((a) => a.questionId === q.id);
              return (
                <div
                  key={idx}
                  onClick={() => setQuestionPresentIndex(idx)}
                  className={`w-full h-16 cursor-pointer text-3xl font-sans font-semibold border rounded-md flex items-center justify-center ${
                    isAnswred
                      ? "bg-green-50 border-green-500"
                      : questionPresentIndex === idx
                      ? "bg-blue-50 border-blue-500"
                      : "border-gray-300"
                  }`}
                >
                  {idx + 1}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTestPage;
