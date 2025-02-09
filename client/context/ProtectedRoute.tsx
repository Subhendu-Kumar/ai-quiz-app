"use client";

import { useEffect } from "react";
import { useAuth } from "./provider";
import { useRouter } from "next/navigation";
import { ImSpinner9 } from "react-icons/im";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, loading, router]);

  if (loading)
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <ImSpinner9 className="animate-spin text-4xl" />
      </div>
    );

  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;
