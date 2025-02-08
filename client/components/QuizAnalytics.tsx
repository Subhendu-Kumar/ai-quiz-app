"use client";

import {
  FaArrowRightLong,
  FaArrowRotateRight,
  FaFileCircleQuestion,
} from "react-icons/fa6";
import Stats from "./Stats";
import moment from "moment";
import { Button } from "./ui/button";
import { AnalyticsQuiz } from "@/types";
import { TbXboxX } from "react-icons/tb";
import { getQuizAnalytics } from "@/api";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { LuAlarmClock } from "react-icons/lu";
import { MdCalendarMonth } from "react-icons/md";
import { BsFillSkipForwardFill } from "react-icons/bs";
import React, { use, useEffect, useState } from "react";
import { FaHandPointUp, FaRegCheckCircle } from "react-icons/fa";

const QuizAnalytics = ({
  params,
}: {
  params: Promise<{ attemptid: string }>;
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const { attemptid } = use(params);
  const [loading, setLoading] = useState<boolean>(false);
  const [analyticsData, setAnalyticsData] = useState<AnalyticsQuiz | null>(
    null
  );

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const res = await getQuizAnalytics(attemptid);
        if (res.data.success) {
          setAnalyticsData(res.data);
        } else {
          toast({
            title: "Error",
            description: res.data.message,
            variant: "destructive",
          });
          router.push("/dashboard");
        }
      } catch (error) {
        console.log(error);
        toast({
          title: "Error",
          description: "Something wrong while fetchine data!!",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center">
        <img src="/rise.svg" alt="test logo" className="w-40 h-auto" />
        <div className="mt-3 flex items-center justify-center gap-3 text-3xl">
          <FaArrowRotateRight className="animate-spin" />
          <p>loading your analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen p-20 pb-4 absolute">
      <div className="flex w-full h-14 items-center justify-between gap-2 px-4 py-1 bg-zinc-50 border-b border-gray-400 fixed top-0 left-0">
        <div className="flex items-center justify-center gap-2">
          <img src="/logo.svg" alt="app logo" className="w-12 h-12" />
          <p className="text-3xl font-semibold font-sans">Quizlytic</p>
        </div>
        <p className="text-2xl font-semibold font-sans">Analytics page</p>
        <div className="flex items-center justify-center gap-3">
          <Button className="bg-green-500 hover:bg-green-500/90">
            <FaArrowRightLong />
          </Button>
        </div>
      </div>
      <div className="w-full h-auto mt-5 border border-blue-300 bg-blue-50 rounded-lg p-6">
        <div className="w-full h-auto flex items-start justify-between">
          <div className="flex items-start justify-start flex-col gap-2">
            <h1 className="capitalize text-xl font-sans font-semibold">
              {analyticsData?.attempt?.quiz?.title} :{" "}
              {analyticsData?.attempt?.quiz?.quiz_type}
            </h1>
            <p className="flex items-center justify-center gap-1 font-medium font-sans text-base">
              <FaFileCircleQuestion className="text-green-300 shadow-sm" />{" "}
              {analyticsData?.totalNoOfQuestions} Questions .{" "}
              {analyticsData?.totalNoOfQuestions} Marks{" "}
              <LuAlarmClock className="text-yellow-600" />{" "}
              {analyticsData?.totalNoOfQuestions &&
                analyticsData.totalNoOfQuestions * 1.5}{" "}
              mins
            </p>
            <p className="flex items-center justify-center gap-1 font-medium font-sans text-sm">
              <MdCalendarMonth className="text-red-400" /> Attempted on :{" "}
              {moment(analyticsData?.attempt.attemptedAt).format("DD MMM YYYY")}
            </p>
          </div>
          <Button className="bg-blue-500 hover:bg-blue-500/90 font-sans font-semibold">
            View Solutions
          </Button>
        </div>
      </div>
      <h1 className="capitalize text-xl font-sans font-semibold mt-6">
        result summary
      </h1>
      <div className="w-full h-auto mt-3 border border-purple-300 bg-purple-50 rounded-lg p-6">
        <div className="w-full h-auto flex items-start justify-between">
          <div className="flex items-start justify-start flex-col gap-2">
            <p className="uppercase text-lg font-sans font-semibold">score</p>
            <h1 className="font-sans font-semibold text-xl text-gray-500">
              <span className="text-5xl text-blue-600">
                {analyticsData?.securedMark}
              </span>
              /{analyticsData?.totalNoOfQuestions}
            </h1>
          </div>
          <img src="/rise.svg" alt="rise svg" className="w-24 h-auto" />
        </div>
      </div>
      <div className="w-full h-auto mt-8 p-6 rounded-lg bg-indigo-50 border border-indigo-300">
        <h1 className=" capitalize text-xl font-sans font-semibold text-center">
          your progress
        </h1>
        {analyticsData && (
          <div className="w-full mt-4 h-auto grid grid-cols-4 gap-5">
            <Stats
              color="text-green-500"
              icon={FaRegCheckCircle}
              text="correct"
              subText="marks obtaines"
              total={analyticsData?.totalNoOfQuestions}
              obtained={analyticsData?.securedMark}
            />
            <Stats
              color="text-red-500"
              icon={TbXboxX}
              text="incorrect"
              subText="marks lost"
              total={analyticsData?.totalNoOfQuestions}
              obtained={analyticsData?.incorrectAns}
            />
            <Stats
              color="text-gray-500"
              icon={BsFillSkipForwardFill}
              text="skipped"
              subText="marks skipped"
              total={analyticsData?.totalNoOfQuestions}
              obtained={analyticsData?.noOfQuestionsSkipped}
            />
            <Stats
              color="text-blue-500"
              icon={FaHandPointUp}
              text="accuracy"
              accuracy={analyticsData.accuracy}
            />
          </div>
        )}
      </div>
      <div className="w-full h-auto mt-16 flex items-center text-sm font-sans font-semibold text-gray-600 justify-center">
        Thank you for completing the quiz! 🎉 Want to improve? Learn more and
        boost your score!
      </div>
    </div>
  );
};

export default QuizAnalytics;
