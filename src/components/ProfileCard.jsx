import { doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../firebase/config";
import { UserIcon } from "./UserIcon";
import Progress from "./Progress";
import { Link } from "react-router-dom";

const ProfileCard = ({ course: initialCourse }) => {
  const { user, id } = useSelector((state) => state.user);
  const [course, setCourse] = useState(initialCourse);

  const MarkCompleted = async (courseId) => {
    if (!id || !courseId) return;
    try {
      const studentRef = doc(db, "students", id);
      const studentDoc = await getDoc(studentRef);
      if (studentDoc.exists()) {
        const courses = studentDoc.data().courses || [];
        const index = courses.findIndex(
          (course) => course.courseId === courseId
        );
        if (index !== -1) {
          courses[index].completed = true;
          courses[index].progress = 100;
          await updateDoc(studentRef, { courses });
          setCourse({ ...course, completed: true, progress: 100 });
        } else {
          console.error("Course not found in student's courses array.");
        }
      } else {
        console.error("Student document does not exist.");
      }
    } catch (error) {
      console.error("Error updating course data:", error);
    }
  };

  return (
    <div
      key={course.id}
      className="bg-white shadow-md rounded-md cursor-pointer relative"
    >
      <div className="md:h-[200px] rounded-t-md group overflow-hidden">
        <Link to={`/course/${course.id}`}>
          <img
            src={course.thumbnail}
            className="w-full object-cover rounded-t-md group-hover:scale-105 transition-animate"
          />
        </Link>
      </div>
      <div className="px-2 mb-5">
        <Link to={`/course/${course.id}`}>
          <p className="mt-2 text-lg font-semibold">{course.name}</p>
          <p className="text-sm text-slate-600 flex justify-start mt-1 items-center">
            <UserIcon /> {course.instructor}
          </p>
        </Link>
        <p className="text-sm my-4 text-slate-600 flex justify-start items-center">
          <Progress progress={course.progress} />
          <p className="mx-2">{course.progress}%</p>
        </p>
        {course.completed ? (
          <button
            className="rounded-md mx-auto bg-slate-600 bg-gradient-to-br shadow-md  w-full px-4 py-2 text-white text-sm font-medium"
            onClick={() => MarkCompleted(course.id)}
          >
            Course Completed
          </button>
        ) : (
          <button
            className="rounded-md mx-auto from-indigo-600 to-indigo-500 bg-gradient-to-br shadow-md shadow-indigo-400/40 w-full px-4 py-2 text-white text-sm font-medium"
            onClick={() => MarkCompleted(course.id)}
          >
            Mark As Completed
          </button>
        )}
      </div>
    </div>
  );
};

export default ProfileCard;
