"use client";

import { Quiz } from "@/types";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getUserDetails } from "@/lib/utils";
import { FaArrowRight } from "react-icons/fa";
import React, { useEffect, useState } from "react";
import { quizFetchRecent, quizFetchRecentMe } from "@/api";

const RecentQuizes = () => {
  const router = useRouter();
  const { toast } = useToast();
  const user = getUserDetails();
  const [quizes, setQuizes] = useState<Quiz[] | []>([]);
  const [quizesMe, setQuizesMe] = useState<Quiz[] | []>([]);
  const [fetchingQuiz, setFetchingQuiz] = useState<boolean>(false);
  const [fetchingQuizMe, setFetchingQuizMe] = useState<boolean>(false);

  useEffect(() => {
    const fetchQuiz = async () => {
      setFetchingQuiz(true);
      try {
        const res = await quizFetchRecent();
        if (res.data.success) {
          setQuizes(res.data.quizes);
        } else {
          toast({
            title: "Error",
            description: res.data.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.log("error fetching quiz: ", error);
        toast({
          title: "Error",
          description: "some thing went wrong",
          variant: "destructive",
        });
      } finally {
        setFetchingQuiz(false);
      }
    };
    fetchQuiz();
  }, [toast]);

  useEffect(() => {
    const fetchQuizMe = async () => {
      setFetchingQuizMe(true);
      try {
        const res = await quizFetchRecentMe();
        if (res.data.success) {
          setQuizesMe(res.data.quizes);
        } else {
          toast({
            title: "Error",
            description: res.data.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        console.log("error fetching quiz: ", error);
        toast({
          title: "Error",
          description: "some thing went wrong",
          variant: "destructive",
        });
      } finally {
        setFetchingQuizMe(false);
      }
    };
    if (user?.role === "CREATOR") {
      fetchQuizMe();
    }
  }, [toast, user?.role]);

  const handleClick = (quizid: string) => {
    router.push(`/practice/${quizid}`);
  };

  return (
    <div className="mt-8 w-full h-auto">
      <h1 className="text-xl font-semibold font-sans">
        Recently published quizes
      </h1>
      {fetchingQuiz ? (
        <div className="w-full h-auto mt-6 grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="w-full h-40 rounded-lg" />
          ))}
        </div>
      ) : quizes.length === 0 ? (
        <p className="text-center text-gray-500 mt-6">No quizzes found.</p>
      ) : (
        <div className="w-full h-auto mt-6 grid grid-cols-4 gap-4">
          {quizes.map((quiz) => (
            <Button
              key={quiz.id}
              variant="secondary"
              onClick={() => handleClick(quiz.id)}
              className="w-full h-40 bg-orange-50 hover:bg-orange-200 flex items-start justify-between flex-col rounded-lg p-4 relative"
            >
              <div className="absolute top-4 right-4 p-2 rounded-full flex items-center justify-center bg-orange-200">
                <FaArrowRight />
              </div>
              <div className="w-full h-auto flex flex-col items-start justify-start">
                <p className="font-semibold text-lg">{quiz.title}</p>
                <p className="text-sm text-gray-600">{quiz.description}</p>
                <p className="text-sm text-gray-700">Type: {quiz.quiz_type}</p>
              </div>
              <div className="w-full h-auto flex items-center justify-between">
                <p className="text-sm text-gray-700">
                  Created by: {quiz.creator?.username}
                </p>
                <p className="text-sm text-gray-500">
                  {new Date(quiz.createdAt).toLocaleDateString()}
                </p>
              </div>
            </Button>
          ))}
        </div>
      )}
      {user?.role === "CREATOR" && (
        <>
          <h1 className="text-xl font-semibold font-sans mt-6">
            Recent quizes by me
          </h1>
          {fetchingQuizMe ? (
            <div className="w-full h-auto mt-6 grid grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, index) => (
                <Skeleton key={index} className="w-full h-40 rounded-lg" />
              ))}
            </div>
          ) : quizesMe.length === 0 ? (
            <p className="text-center text-gray-500 mt-6">No quizzes found.</p>
          ) : (
            <div className="w-full h-auto mt-6 grid grid-cols-4 gap-4">
              {quizesMe.map((quiz) => (
                <Button
                  key={quiz.id}
                  variant="secondary"
                  onClick={() => handleClick(quiz.id)}
                  className="w-full relative h-40 bg-orange-50 flex items-start justify-between flex-col rounded-lg p-4"
                >
                  <div className="absolute top-4 right-4 p-2 rounded-full flex items-center justify-center bg-orange-200">
                    <FaArrowRight />
                  </div>
                  <div className="w-full h-auto flex flex-col items-start justify-start">
                    <p className="font-semibold text-lg">{quiz.title}</p>
                    <p className="text-sm text-gray-600">{quiz.description}</p>
                    <p className="text-sm text-gray-700">
                      Type: {quiz.quiz_type}
                    </p>
                  </div>
                  <div className="w-full h-auto flex items-center justify-between">
                    <p className="text-sm text-gray-700">
                      Created by: {quiz.creator?.username}
                    </p>
                    <p className="text-sm text-gray-500">
                      {new Date(quiz.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default RecentQuizes;
