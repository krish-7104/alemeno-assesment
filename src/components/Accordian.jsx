import React, { useState } from "react";
import { BiChevronDown } from "react-icons/bi";

const Accordian = ({ topic, content, week, open, setOpen, index }) => {
  const toggleAccordion = () => {
    setOpen(open === index ? undefined : index);
  };

  return (
    <>
      <div
        className="w-full text-left flex justify-between items-center px-4 py-2 focus:outline-none text-[#28262C] cursor-pointer select-none font-medium rounded-md mb-2"
        onClick={toggleAccordion}
      >
        <p className="flex justify-between items-center w-full">
          <span>
            <span className="text-sm text-indigo-600 mr-2">{week}.</span>{" "}
            {topic}
          </span>
          <BiChevronDown
            size={25}
            className={` ${
              open === index
                ? "rotate-180 text-indigo-600"
                : "rotate-0 text-[#28262C]"
            }`}
          />
        </p>
      </div>
      {open === index && (
        <div className="px-4 mb-3 text-[#28262C]">
          <p className="text-slate-800 text-sm">{content}</p>
        </div>
      )}
    </>
  );
};

export default Accordian;
