import React from "react";
import { StatsData } from "@/types";

const Stats = ({
  text,
  total,
  color,
  subText,
  obtained,
  accuracy,
  icon: Icon,
}: StatsData) => {
  const percentage = obtained && total && (obtained / total) * 100;
  return (
    <div className="w-full h-auto p-3 bg-white/90 rounded-md flex items-start justify-start flex-col gap-2">
      <div className="w-full h-auto flex items-center justify-between text-base font-sans font-medium capitalize">
        <p className="flex items-center justify-center gap-2 leading-none">
          <Icon className={color} /> {text}
        </p>
        <p>{accuracy ? `${accuracy}%` : `${obtained}/${total}`}</p>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-1.5">
        <div
          className="bg-blue-400 h-full rounded-full transition-all duration-300"
          style={{ width: `${accuracy? accuracy : percentage}%` }}
        />
      </div>
      {subText && (
        <div className="w-full h-auto flex items-center justify-between text-sm font-sans text-gray-500 font-medium capitalize">
          <p>{subText}</p>
          <p>{obtained}</p>
        </div>
      )}
    </div>
  );
};

export default Stats;
