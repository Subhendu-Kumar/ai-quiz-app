"use client";

import React, { use } from "react";
import { Button } from "./ui/button";
import { Checkbox } from "./ui/checkbox";
// import { FaArrowRotateRight } from "react-icons/fa6";

const QuizTestPage = ({
  params,
}: {
  params: Promise<{ quizid: string; attemptid: string }>;
}) => {
  const { quizid, attemptid } = use(params);
  console.log("quizId: ", quizid);
  console.log("attemptId: ", attemptid);

  // const [loading, setLoading] = useState<boolean>(false);

  // if (loading) {
  //   return (
  //     <div className="w-full h-screen flex flex-col items-center justify-center">
  //       <img src="/test.svg" alt="test logo" className="w-40 h-auto" />
  //       <div className="mt-3 flex items-center justify-center gap-3 text-2xl">
  //         <FaArrowRotateRight className="animate-spin" />
  //         <p>Preparing your test!!</p>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="w-full h-screen p-3">
      <div className="flex w-full h-14 items-center justify-between gap-2 px-2 py-1 bg-zinc-50 border border-gray-100 rounded-lg">
        <div className="flex items-center justify-center gap-2">
          <img src="/logo.svg" alt="app logo" className="w-12 h-12" />
          <p className="text-3xl font-semibold font-sans">Quizlytic</p>
        </div>
        <p className="text-2xl font-semibold font-sans">Test Page</p>
        <div className="flex items-center justify-center gap-3">
          <Button className="bg-green-500 hover:bg-green-500/90">
            submit test
          </Button>
          <Button variant="destructive">leave test</Button>
        </div>
      </div>
      <div className="w-full h-[calc(100vh-80px)] flex items-center justify-center pt-3 gap-3">
        <div className="w-[70%] h-full border rounded-lg border-gray-200 overflow-hidden flex items-start justify-start flex-col">
          <div className="w-full h-[90%] p-4">
            <h1 className="font-sans font-semibold text-xl text-wrap">
              Q1.&#x29;{" "}
              <span className="text-lg font-sans font-medium text-gray-600">
                The code for the close paren is....
              </span>
            </h1>
            <div className="w-full h-auto flex items-start justify-start gap-3 mt-6 flex-col">
              {Array.from({ length: 4 }).map((_, idx) => {
                return (
                  <div
                    key={idx}
                    className="w-full h-auto flex items-center justify-start gap-2"
                  >
                    <Checkbox />
                    <p className="text-lg font-sans font-medium">
                      {String.fromCharCode(65 + idx).toUpperCase()}.&#x29;
                    </p>
                    <p className="text-base font-sans font-normal">
                      option {idx + 1}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="w-full h-[10%] border-t border-gray-200 rounded-lg px-4 flex items-center justify-end">
            <Button className="bg-green-500 hover:bg-green-500/90 text-lg font-sans font-semibold">
              Save & Next
            </Button>
          </div>
        </div>
        <div className="w-[30%] h-full p-4 border border-gray-200 rounded-lg overflow-hidden">
          <div className="w-full h-auto p-3 rounded-lg bg-green-50 flex items-start justify-start flex-col gap-3">
            <h1 className="font-sans font-semibold text-base">
              Total no. of Questions: 4
            </h1>
            <div className="w-full h-auto grid grid-cols-2 gap-2">
              <div className="w-full h-auto flex items-center justify-start gap-2">
                <div className="w-6 h-6 rounded-sm flex items-center justify-center bg-green-500 text-white">
                  0
                </div>
                <p className="text-base font-sans font-semibold">Answered</p>
              </div>
              <div className="w-full h-auto flex items-center justify-start gap-2">
                <div className="w-6 h-6 rounded-sm flex items-center justify-center bg-red-500 text-white">
                  4
                </div>
                <p className="text-base font-sans font-semibold">
                  Not Answered
                </p>
              </div>
            </div>
          </div>
          <div className="w-full h-auto gap-2 mt-6 grid grid-cols-5">
            <div className="w-full h-16 cursor-pointer text-3xl font-sans font-semibold border border-gray-300 rounded-md flex items-center justify-center">
              1
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default QuizTestPage;
