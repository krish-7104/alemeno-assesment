import React from "react";

const Progress = ({ progress }) => {
  return (
    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full bg-indigo-500"
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  );
};

export default Progress;
