"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "./provider";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/signin");
    }
  }, [isAuthenticated, loading, router]);

  if (loading) return <p>Loading...</p>;

  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;
