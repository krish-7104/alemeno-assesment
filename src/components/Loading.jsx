import React from "react";
import { AiOutlineLoading3Quarters } from "react-icons/ai";

const Loading = () => {
  return (
    <div className="flex justify-center items-center mt-20">
      <AiOutlineLoading3Quarters size={28} className="animate-spin" />
    </div>
  );
};

export default Loading;
