import React from "react";
import QuizAnalytics from "@/components/QuizAnalytics";
import ProtectedRoute from "@/context/ProtectedRoute";

const AttemptAnalyticsPage = ({
  params,
}: {
  params: Promise<{ attemptid: string }>;
}) => {
  return (
    <ProtectedRoute>
      <QuizAnalytics params={params} />
    </ProtectedRoute>
  );
};

export default AttemptAnalyticsPage;
