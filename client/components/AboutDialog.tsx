import React from "react";
import {
  AlertDialog,
  AlertDialogTitle,
  AlertDialogCancel,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogContent,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";

const AboutDialog = ({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) => {
  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="font-sans font-bold text-xl">
            About Quizlytics
          </AlertDialogTitle>
          <AlertDialogDescription>
            Quizlytics is your go-to analytics platform for tracking and
            improving quiz performance. Whether you&apos;re a student, educator,
            or quiz enthusiast, Quizlytics provides in-depth insights into your
            quiz attempts, accuracy, and progress over time.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="w-full h-auto flex items-start justify-start flex-col gap-2">
          <h1 className="text-xl font-sans font-semibold">Why Quizlytics?</h1>
          <p className="text-sm font-sans font-semibold text-gray-500">
            ✅ Detailed Performance Insights – Get a breakdown of your accuracy,
            total marks secured, and questions attempted.
          </p>
          <p className="text-sm font-sans font-semibold text-gray-500">
            ✅ Track Your Progress – Monitor your highest scores, skipped
            questions, and quiz attempts.
          </p>
          <p className="text-sm font-sans font-semibold text-gray-500">
            ✅ Improve with Analytics – Use data-driven insights to enhance your
            learning and strategy.
          </p>
          <p className="text-sm font-sans font-semibold text-gray-500">
            ✅ User-Friendly Dashboard – A clean and intuitive interface for
            quick access to your quiz stats.
          </p>
          <h1 className="text-xl font-sans font-semibold">
            Key Metrics We Provide:
          </h1>
          <p className="text-sm font-sans font-semibold text-gray-500">
            📊 Total Accuracy – Understand how well you&apos;re performing
            across quizzes.
          </p>
          <p className="text-sm font-sans font-semibold text-gray-500">
            📌 Quiz Attempts – Track the number of quizzes you&apos;ve taken.
          </p>
          <p className="text-sm font-sans font-semibold text-gray-500">
            🔍 Skipped vs. Attempted Questions – Identify areas where you can
            improve.
          </p>
          <p className="text-sm font-sans font-semibold text-gray-500">
            🏆 Highest Score – Keep an eye on your best performance.
          </p>
          <p className="text-sm font-sans font-semibold text-gray-500">
            ⚡ Average Score Per Quiz – See how you&apos;re doing on average.
          </p>
        </div>
        <p className="text-base font-sans font-medium text-gray-500">
          With Quizlytics, learning becomes smarter, performance tracking is
          effortless, and every quiz attempt brings you closer to mastery! 🚀
        </p>
        <AlertDialogFooter>
          <AlertDialogCancel>Close</AlertDialogCancel>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default AboutDialog;
