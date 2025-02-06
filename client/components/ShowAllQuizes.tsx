"use client";

import { Quiz } from "@/types";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { getPaginatedQuiz } from "@/api";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useState } from "react";

const ShowAllQuizes = () => {
  const { toast } = useToast();
  const [page, setPage] = useState<number>(1);
  const [quizes, setQuizes] = useState<Quiz[]>([]);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [fetchingQuiz, setFetchingQuiz] = useState<boolean>(false);

  const filteredQuizes = quizes.filter(
    (quiz) =>
      quiz.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      quiz.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const fetchQuiz = async (pageNumber: number) => {
    setFetchingQuiz(true);
    try {
      const res = await getPaginatedQuiz(pageNumber);
      if (res.data.success) {
        setQuizes((prev) => {
          const newQuizzes = res.data.quizes.filter(
            (quiz: Quiz) => !prev.some((q) => q.id === quiz.id)
          );
          return [...prev, ...newQuizzes];
        });
        setHasMore(res.data.quizes.length > 0);
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

  useEffect(() => {
    fetchQuiz(page);
  }, []);

  const handleLoadMore = () => {
    setPage((prev) => prev + 1);
    fetchQuiz(page + 1);
  };

  return (
    <div className="w-full p-10 h-auto">
      <div className="w-full h-auto flex items-center justify-between">
        <h1 className="text-xl font-sans font-semibold">All Quizes</h1>
        <Input
          className="w-[40%] h-10 border-black"
          placeholder="Search quizes"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="w-full h-auto mt-8 grid grid-cols-4 gap-4">
        {filteredQuizes.map((quiz, idx) => {
          return (
            <Button
              key={idx}
              variant="secondary"
              className="w-full h-40 bg-orange-50 flex items-start justify-between flex-col rounded-lg p-4"
            >
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
          );
        })}
      </div>
      {hasMore && (
        <div className="w-full flex justify-center mt-6">
          <Button
            onClick={handleLoadMore}
            disabled={fetchingQuiz}
            variant="outline"
            className="px-6 py-2"
          >
            {fetchingQuiz ? "Loading..." : "Load More"}
          </Button>
        </div>
      )}
    </div>
  );
};

export default ShowAllQuizes;
