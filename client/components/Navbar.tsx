"use client";

import {
  Menubar,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
  MenubarContent,
  MenubarSeparator,
} from "@/components/ui/menubar";
import Link from "next/link";
import { Button } from "./ui/button";
import React, { useState } from "react";
import ProfileDialog from "./ProfileDialog";
import { useAuth } from "@/context/provider";
import { getUserDetails } from "@/lib/utils";
import { usePathname, useRouter } from "next/navigation";

const Navbar = () => {
  const router = useRouter();
  const user = getUserDetails();
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [showProfile, setShowProfile] = useState<boolean>(false);

  return (
    <div className="w-full h-16 top-0 left-0 bg-white/70 backdrop-blur-md fixed z-50 shadow-md px-10 flex items-center justify-between">
      <ProfileDialog
        open={showProfile}
        onOpenChange={setShowProfile}
        user={user!}
      />
      <Link
        href={"/dashboard"}
        className="flex cursor-pointer items-center justify-center gap-2 px-2 py-1 bg-zinc-50 border border-gray-100 rounded-lg"
      >
        <img src="/logo.svg" alt="app logo" className="w-10 h-10" />
        <p className="text-3xl font-semibold font-sans">Quizlytic</p>
      </Link>
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={() => router.push("/dashboard/allquizes")}
          className={`text-lg font-medium text-black py-1 px-2 rounded-md ${
            pathname === "/dashboard/allquizes"
              ? "bg-green-50"
              : "hover:bg-green-50"
          }`}
        >
          All quizes
        </button>
        <button
          onClick={() => router.push("/dashboard/myanalytics")}
          className={`text-lg font-medium text-black py-1 px-2 rounded-md ${
            pathname === "/dashboard/myanalytics"
              ? "bg-green-50"
              : "hover:bg-green-50"
          }`}
        >
          My analytics
        </button>
        <button className="text-lg font-medium text-black hover:bg-green-50 py-1 px-2 rounded-md">
          About
        </button>
        <button className="text-lg font-medium text-black hover:bg-green-50 py-1 px-2 rounded-md">
          Contact
        </button>
      </div>
      <div className="flex items-center justify-center gap-4">
        <Menubar className="border-none bg-transparent p-0 m-0 shadow-none">
          <MenubarMenu>
            <MenubarTrigger>
              <div className="w-10 h-10 cursor-pointer rounded-full overflow-hidden">
                <img
                  src={user?.avatar}
                  alt="logo"
                  className="w-full h-full object-cover object-center"
                />
              </div>
            </MenubarTrigger>
            <MenubarContent align="end">
              <MenubarItem>
                <button
                  className="w-full text-left"
                  onClick={() => setShowProfile(true)}
                >
                  My Profile
                </button>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem>
                <button className="w-full text-left" onClick={logout}>
                  Signout
                </button>
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
        {!isAuthenticated && (
          <Button onClick={() => router.push("/signin")}>Sign in</Button>
        )}
      </div>
    </div>
  );
};

export default Navbar;
