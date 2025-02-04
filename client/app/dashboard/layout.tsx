"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { useAuth } from "@/context/provider";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const DashBoardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  const router = useRouter();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, router]);

  return (
    <div className="w-full h-screen relative">
      <Navbar />
      <div className="w-full min-h-screen pt-16">{children}</div>
      <Footer />
    </div>
  );
};

export default DashBoardLayout;
