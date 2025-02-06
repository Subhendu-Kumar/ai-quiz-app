"use client";

import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import ProtectedRoute from "@/context/ProtectedRoute";
import React from "react";

const DashBoardLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ProtectedRoute>
      <div className="w-full h-screen relative">
        <Navbar />
        <div className="w-full min-h-screen pt-16">{children}</div>
        <Footer />
      </div>
    </ProtectedRoute>
  );
};

export default DashBoardLayout;
