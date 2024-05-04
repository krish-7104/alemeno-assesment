import { useState } from "react";
import { Link } from "react-router-dom";
import { UserIcon } from "./UserIcon";
import { useSelector } from "react-redux";

const CourseCard = ({
  image,
  name,
  instructor,
  status,
  courseId,
  students,
}) => {
  const [like, setLike] = useState("");
  const { id } = useSelector((state) => state.user);
  return (
    <Link
      to={`/course/${courseId}`}
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
        <p className="text-sm text-slate-600 flex justify-start mt-1 items-center">
          <UserIcon /> {instructor}
        </p>
      </div>
      <span
        className={`px-3 py-1 text-xs rounded-full font-medium ${
          status === "Open" ? "bg-green-600" : "bg-red-600"
        } text-white absolute top-4 right-4`}
      >
        {status}
      </span>
      <div className="flex px-4 mx-auto justify-between items-center mb-4">
        <p className="text-sm">
          {students.length ? students.length : 0} Students Enrolled
        </p>
        {status !== "Closed" && !students.includes(id) ? (
          <button className="rounded-md w-[40%] from-indigo-600 to-indigo-500 bg-gradient-to-br shadow-md shadow-indigo-400/40 px-4 py-2 text-white text-xs font-medium">
            Enroll Now
          </button>
        ) : (
          status !== "Closed" && (
            <button className="rounded-md bg-slate-700 px-4 py-2 text-white font-medium text-xs">
              Already Enrolled
            </button>
          )
        )}
      </div>
    </Link>
  );
};

export default CourseCard;
