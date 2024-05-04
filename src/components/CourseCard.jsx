import { useState } from "react";
import { Link } from "react-router-dom";
import { UserIcon } from "./UserIcon";
import { useSelector } from "react-redux";
import { BiLike, BiSolidLike } from "react-icons/bi";
import toast from "react-hot-toast";
import {
  arrayRemove,
  arrayUnion,
  doc,
  increment,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";

const CourseCard = ({
  image,
  name,
  instructor,
  status,
  courseId,
  students,
  liked: initialLiked,
  likes: initialLikes,
}) => {
  const { id } = useSelector((state) => state.user);
  const [liked, setLiked] = useState(initialLiked);
  const [likes, setLikes] = useState(initialLikes);

  const LikeHandler = async () => {
    if (!id) return;
    try {
      const studentRef = doc(db, "students", id);
      const courseRef = doc(db, "courses", courseId);
      setLiked(!liked);
      if (liked) {
        setLikes((prev) => prev - 1);
        await updateDoc(courseRef, { likes: increment(-1) });
        await updateDoc(studentRef, { likes: arrayRemove(courseId) });
      } else {
        setLikes((prev) => prev + 1);
        await updateDoc(studentRef, { likes: arrayUnion(courseId) });
        await updateDoc(courseRef, { likes: increment(1) });
      }
    } catch (error) {
      console.error("Error updating liked courses:", error);
      toast.error("Failed to update liked courses");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-md cursor-pointer relative group ">
      <div className="md:h-[200px] overflow-hidden rounded-t-md relative">
        <img
          src={image}
          className="w-full object-cover rounded-t-md group-hover:scale-105 transition-animate"
        />
        <div
          className="absolute z-20 bottom-4 right-4 text-sm bg-white px-2 py-1 rounded-lg flex justify-center items-center"
          onClick={LikeHandler}
        >
          {liked ? (
            <BiSolidLike className="mr-1" />
          ) : (
            <BiLike className="mr-1" />
          )}{" "}
          {likes}
        </div>
      </div>
      <Link to={`/course/${courseId}`}>
        <div>
          <p className="mt-2 text-lg font-semibold mx-3">{name}</p>
          <p className="text-sm text-slate-600 flex justify-start mx-3 items-center">
            <UserIcon /> {instructor}
          </p>
        </div>
        <span
          className={`px-3 py-1 text-xs rounded-full font-medium ${
            status === "Open"
              ? "bg-green-600"
              : status === "In Progress"
              ? "bg-indigo-600"
              : "bg-red-600"
          } text-white absolute top-4 right-4`}
        >
          {status}
        </span>
        <div className="flex px-4 mx-auto justify-between items-center mb-4 mt-2">
          <p className="text-sm">
            {students.length ? students.length : 0} Students Enrolled
          </p>
          <button className="rounded-md w-[40%] from-indigo-600 to-indigo-500 bg-gradient-to-br shadow-md shadow-indigo-400/40 px-4 py-2 text-white text-xs font-medium">
            More Details
          </button>
        </div>
      </Link>
    </div>
  );
};

export default CourseCard;
