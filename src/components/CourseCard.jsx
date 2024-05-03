import { useState } from "react";
import { Link } from "react-router-dom";

const CourseCard = ({ image, name, instructor, status, id, students }) => {
  const [like, setLike] = useState("");
  return (
    <Link
      to={`/course/${id}`}
      className="bg-white shadow-md rounded-md cursor-pointer relative group "
    >
      <div className="h-[200px] overflow-hidden rounded-t-md">
        <img
          src={image}
          className="w-full object-cover rounded-t-md group-hover:scale-105 transition-animate"
        />
      </div>
      <div className="px-2 mb-3">
        <p className="mt-2 text-lg font-semibold">{name}</p>
        <p className="text-sm text-gray-600 flex justify-start mt-1 items-center">
          <UserIcon /> {instructor}
        </p>
      </div>
      <span
        className={`px-3 py-1 text-xs rounded-full font-medium ${
          status === "Open" ? "bg-green-600" : "bg-red-600"
        } text-white absolute top-4 right-4 bg-white`}
      >
        {status}
      </span>
      <div className="flex px-4 mx-auto justify-between items-center mb-4">
        <p className="text-sm">{students ? students : 0} Students Enrolled</p>
        <button className="rounded-md w-[40%] from-purple-600 to-purple-500 bg-gradient-to-br shadow-md shadow-purple-400/40 px-4 py-2 text-white text-sm font-medium">
          Enroll Now
        </button>
      </div>
    </Link>
  );
};

export default CourseCard;

function UserIcon(props) {
  return (
    <svg
      className="mr-1"
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}
