"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import { getUserDetails } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import RecentQuizes from "@/components/RecentQuizes";

const DashboardHome = () => {
  const router = useRouter();
  const { toast } = useToast();
  const user = getUserDetails();

  const handleClick = () => {
    if (user?.role === "CREATOR") {
      router.push("/dashboard/createquiz");
    } else {
      toast({
        title: "Unauthorized",
        description:
          "you are not a Creator, please create an CREATOR account to create quiz!!",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full p-10 min-h-screen select-none">
      <div className="w-full h-auto grid sm:grid-cols-2 grid-cols-1 gap-4">
        <div className="w-full h-72 rounded-lg bg-[#19444A] flex items-center justify-start p-4">
          <img src="/boy-quiz.svg" className="w-64 h-64" alt="logo" />
          <div className="w-full h-full flex items-center justify-center flex-col">
            <h1 className="text-4xl font-sans font-semibold text-white">
              Create a Quiz
            </h1>
            <p className="text-base text-center font-sans font-semibold text-white">
              use our quiz editor to create quiz of your choice
            </p>
            <Button variant="secondary" className="mt-4" disabled>
              create quiz
            </Button>
          </div>
        </div>
        <div className="w-full h-72 rounded-lg bg-[#19444A] flex items-center justify-start p-4">
          <img src="/boy-quiz.svg" className="w-64 h-64" alt="logo" />
          <div className="w-full h-full flex items-center justify-center flex-col">
            <h1 className="text-4xl font-sans font-semibold text-white">
              Generate Quiz with AI
            </h1>
            <p className="text-base text-center font-sans font-semibold text-white">
              use our ai quiz generator to generate quiz of your fav. topic
            </p>
            <Button variant="secondary" className="mt-4" onClick={handleClick}>
              generate quiz
            </Button>
          </div>
        </div>
      </div>
      <RecentQuizes />
    </div>
  );
};

export default DashboardHome;
