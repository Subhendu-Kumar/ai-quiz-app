"use client";

import moment from "moment";
import { Button } from "./ui/button";
import { UserAnalytics } from "@/types";
import { getUserAnalytics } from "@/api";
import { ImSpinner9 } from "react-icons/im";
import { useToast } from "@/hooks/use-toast";
import { LuAlarmClock } from "react-icons/lu";
import { MdCalendarMonth } from "react-icons/md";
import React, { useEffect, useState } from "react";
import { FaFileCircleQuestion } from "react-icons/fa6";

const ShowMyAnalytics = () => {
  const { toast } = useToast();
  const [err, setErr] = useState<string>("");
  const [loading, setLoading] = useState<boolean>();
  const [data, setData] = useState<UserAnalytics | null>(null);

  useEffect(() => {
    const fetchUsrAnalytics = async () => {
      try {
        const res = await getUserAnalytics();
        if (res.data.success) {
          setData(res.data);
        } else {
          setErr(res.data?.message);
          toast({
            title: "Error",
            description: res.data.message,
            variant: "destructive",
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Something went wrong while fetching analytics",
          variant: "destructive",
        });
        console.log("Error", error);
        setErr("something went wrong!");
      } finally {
        setLoading(false);
      }
    };
    fetchUsrAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-gray-500">
        <ImSpinner9 className="animate-spin text-4xl" />
      </div>
    );
  }

  if (err) {
    return (
      <div className="w-full h-96 flex items-center justify-center text-red-500 text-xl">
        <p>{err}</p>
      </div>
    );
  }

  return (
    <div className="w-full h-auto px-10 py-8">
      <div className="w-full h-auto mt-5 border border-blue-300 bg-blue-50 rounded-lg p-6">
        <div className="w-full h-auto flex items-start justify-between">
          <div className="flex items-start justify-start flex-col gap-2">
            <h1 className="capitalize text-xl font-sans font-semibold">
              {data?.user?.username}
            </h1>
            <p className="flex items-center justify-center gap-1 font-medium font-sans text-base">
              <FaFileCircleQuestion className="text-green-300 shadow-sm" />{" "}
              {data?.totalQuizAttempted} Quiz attempts . {data?.totalQuestions}{" "}
              Questions . {data?.totalQuestions} Marks{" "}
              <LuAlarmClock className="text-yellow-600" />{" "}
              {data?.totalQuestions && data.totalQuestions * 1.5} mins
            </p>
            <p className="flex items-center justify-center gap-1 font-medium font-sans text-sm">
              <MdCalendarMonth className="text-red-400" /> Analytics on :{" "}
              {moment(data?.date).format("DD MMM YYYY")}
            </p>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-500/90 font-sans font-semibold">
            View
          </Button>
        </div>
      </div>
      <div className="w-full h-auto p-3 bg-blue-50 mt-4 rounded-md flex items-start justify-start flex-col gap-2">
        <div className="w-full h-auto flex items-center justify-between text-base font-sans font-medium capitalize">
          <p className="flex items-center justify-center gap-2 leading-none">
            Total Questions attempted:
          </p>
          <p>
            {data?.totalAttemptedQuestions}/{data?.totalQuestions}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-blue-400 h-full rounded-full transition-all duration-300"
            style={{
              width: `${
                data?.totalAttemptedQuestions && data?.totalQuestions > 0
                  ? (data?.totalAttemptedQuestions / data?.totalQuestions) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>
      <div className="w-full h-auto p-3 bg-blue-50 mt-4 rounded-md flex items-start justify-start flex-col gap-2">
        <div className="w-full h-auto flex items-center justify-between text-base font-sans font-medium capitalize">
          <p className="flex items-center justify-center gap-2 leading-none">
            Total Secured marks:
          </p>
          <p>
            {data?.totalSecuredMarks}/{data?.totalAttemptedQuestions}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-green-400 h-full rounded-full transition-all duration-300"
            style={{
              width: `${
                data?.totalSecuredMarks && data?.totalAttemptedQuestions > 0
                  ? (data?.totalSecuredMarks / data?.totalAttemptedQuestions) *
                    100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>
      <div className="w-full h-auto p-3 bg-blue-50 mt-4 rounded-md flex items-start justify-start flex-col gap-2">
        <div className="w-full h-auto flex items-center justify-between text-base font-sans font-medium capitalize">
          <p className="flex items-center justify-center gap-2 leading-none">
            Total Marks lost:
          </p>
          <p>
            {data?.totalMarksLost}/{data?.totalAttemptedQuestions}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-red-400 h-full rounded-full transition-all duration-300"
            style={{
              width: `${
                data?.totalMarksLost && data?.totalAttemptedQuestions > 0
                  ? (data?.totalMarksLost / data?.totalAttemptedQuestions) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>
      <div className="w-full h-auto p-3 bg-blue-50 mt-4 rounded-md flex items-start justify-start flex-col gap-2">
        <div className="w-full h-auto flex items-center justify-between text-base font-sans font-medium capitalize">
          <p className="flex items-center justify-center gap-2 leading-none">
            Total Skipped questions:
          </p>
          <p>
            {data?.totalSkippedQuestions}/{data?.totalQuestions}
          </p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-purple-400 h-full rounded-full transition-all duration-300"
            style={{
              width: `${
                data?.totalSkippedQuestions && data?.totalQuestions > 0
                  ? (data?.totalSkippedQuestions / data?.totalQuestions) * 100
                  : 0
              }%`,
            }}
          />
        </div>
      </div>
      <div className="w-full h-auto p-3 bg-blue-50 mt-4 rounded-md flex items-start justify-start flex-col gap-2">
        <div className="w-full h-auto flex items-center justify-between text-base font-sans font-medium capitalize">
          <p className="flex items-center justify-center gap-2 leading-none">
            Accuracy:
          </p>
          <p>{data?.totalAccuracy}%</p>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div
            className="bg-orange-400 h-full rounded-full transition-all duration-300"
            style={{
              width: `${data?.totalAccuracy}%`,
            }}
          />
        </div>
      </div>
      <div className="w-full h-auto flex items-center justify-center gap-4">
        <div className="w-[50%] h-auto p-3 bg-blue-50 mt-4 rounded-md flex items-start justify-start flex-col gap-2">
          <div className="w-full h-auto flex items-center justify-between text-base font-sans font-medium capitalize">
            <p className="flex items-center justify-center gap-2 leading-none">
              Average Secured Mark Per Attempt:
            </p>
            <p className="font-semibold text-xl text-green-600">
              {data?.averageScorePerQuizAttempt.toFixed(2)}
            </p>
          </div>
        </div>
        <div className="w-[50%] h-auto p-3 bg-blue-50 mt-4 rounded-md flex items-start justify-start flex-col gap-2">
          <div className="w-full h-auto flex items-center justify-between text-base font-sans font-medium capitalize">
            <p className="flex items-center justify-center gap-2 leading-none">
              Highest Score of All:
            </p>
            <p className="font-semibold text-xl text-green-600">
              {data?.highestScoreOfAll}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShowMyAnalytics;
