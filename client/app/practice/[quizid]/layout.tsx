import React from "react";
import ProtectedRoute from "@/context/ProtectedRoute";

const StartPracticeLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <ProtectedRoute>
      <div className="w-full min-h-screen">{children}</div>
    </ProtectedRoute>
  );
};

export default StartPracticeLayout;
