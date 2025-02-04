import React from "react";

const Dashboard = () => {
  return (
    <div className="w-full h-auto px-10 py-10">
      <div className="w-full h-72 rounded-lg bg-zinc-50 p-4 border border-gray-100">
        {/* <h1 className="text-center text-xl font-sans font-semibold text-blue-400">
          Your Analytics
        </h1> */}
        <div className="w-full h-full flex flex-col items-center justify-center">
          <p>Create or attempt Quizes to get your analytics!!</p>
          <p className="text-red-400">no data available now</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
