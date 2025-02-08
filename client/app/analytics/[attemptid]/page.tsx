import React from "react";
import QuizAnalytics from "@/components/QuizAnalytics";

const AttemptAnalyticsPage = ({
  params,
}: {
  params: Promise<{ attemptid: string }>;
}) => {
  return <QuizAnalytics params={params} />;
};

export default AttemptAnalyticsPage;
