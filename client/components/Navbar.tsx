"use client";

import React from "react";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { getUserDetails } from "@/lib/utils";
import { useAuth } from "@/context/provider";

const Navbar = () => {
  const router = useRouter();
  const user = getUserDetails();
  const { isAuthenticated, logout } = useAuth();

  return (
    <div className="w-full h-16 top-0 left-0 bg-white/70 backdrop-blur-sm fixed z-50 shadow-md px-10 flex items-center justify-between">
      <div className="flex items-center justify-center gap-2 px-2 py-1 bg-zinc-50 border border-gray-100 rounded-lg">
        <img src="./logo.svg" alt="app logo" className="w-10 h-10" />
        <p className="text-3xl font-semibold font-sans">Quizlytic</p>
      </div>
      <div className="flex items-center justify-center gap-4">
        <div className="w-10 h-10 rounded-full overflow-hidden">
          <img
            src={user?.avatar}
            alt="logo"
            className="w-full h-full object-cover object-center"
          />
        </div>
        {isAuthenticated ? (
          <Button onClick={logout}>sign out</Button>
        ) : (
          <Button onClick={() => router.push("/signin")}>Sign in</Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
