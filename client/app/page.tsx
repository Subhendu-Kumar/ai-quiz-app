"use client";

import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { HiOutlineArrowNarrowRight } from "react-icons/hi";
import { useAuth } from "@/context/provider";
import { useRouter } from "next/navigation";

const Home = () => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="w-full h-screen flex flex-col gap-3 items-center justify-center select-none">
      <div className="flex items-center justify-center gap-2 px-2 py-1 bg-zinc-50 border border-gray-100 rounded-lg">
        <img src="./logo.svg" alt="app logo" className="w-16 h-16" />
        <p className="text-4xl font-semibold font-sans">Quizlytic</p>
      </div>
      <p className="w-[35%] text-center font-medium text-gray-400 text-base">
        Quizlytic is an AI-powered quiz platform that adapts to your skill level
        and provides real-time insights. Challenge yourself, track progress, and
        learn smarter with personalized quizzes and analytics! 🚀
      </p>
      <Button
        className="w-[35%] flex items-center justify-center gap-2"
        onClick={() => router.push("/signin")}
      >
        Explore <HiOutlineArrowNarrowRight />
      </Button>
      <p>
        Made with ❤️ by{" "}
        <a href="https://github.com/Subhendu-Kumar" target="_blank">
          (Subhendu)
        </a>
      </p>
    </div>
  );
};

export default Home;
