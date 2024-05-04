import { useSelector } from "react-redux";
import CourseCard from "../components/CourseCard";
import { useEffect, useState } from "react";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { Link, useNavigate } from "react-router-dom";
import { UserIcon } from "../components/UserIcon";
import { GiProgression } from "react-icons/gi";
import Progress from "../components/Progress";

const Profile = () => {
  const { user, id } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState([]);

  useEffect(() => {
    if (!id) navigate("/");
  }, [id, navigate, user]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const coursesData = [];
        querySnapshot.forEach((doc) => {
          coursesData.push({ id: doc.id, ...doc.data() });
        });
        const enrolledCourses = coursesData.filter((data) =>
          data.students.includes(id)
        );
        fetchProfileData(enrolledCourses);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    const fetchProfileData = async (enrolledCourses) => {
      try {
        const studentRef = doc(db, "students", id);
        const docSnapshot = await getDoc(studentRef);
        if (docSnapshot.exists()) {
          const profileCourses = docSnapshot.data().courses;
          const mergedCourses = profileCourses.map((profileCourse) => {
            const matchedCourse = enrolledCourses.find(
              (course) => course.id === profileCourse.courseId
            );
            if (matchedCourse) {
              return { ...matchedCourse, ...profileCourse };
            } else {
              return profileCourse;
            }
          });
          setProfileData(mergedCourses);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      }
    };

    fetchCourses();
  }, [id]);

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
          await updateDoc(studentRef, { courses });
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
    <section className="pt-28 max-w-6xl mx-auto">
      <div className="flex justify-center md:justify-between items-center">
        <div className="flex justify-center items-center flex-col md:flex-row">
          <img
            src={user.photoURL}
            className="aspect-square rounded-full w-20 border-4 border-indigo-600 md:mr-4"
            alt=""
          />
          <div>
            <p className="font-medium text-2xl mt-4 md:mt-0">
              {user?.displayName}
            </p>
            <p className="mt-[4px] bg-indigo-600 px-4 py-1 text-xs text-white rounded-full">
              {user?.email}
            </p>
          </div>
        </div>
      </div>
      {profileData.length !== 0 && (
        <p className="text-3xl font-semibold text-center my-10">
          Enrolled Courses
        </p>
      )}
      <div className="md:grid md:grid-cols-3 gap-6 w-[90%] mx-auto my-10 flex flex-wrap">
        {profileData.map((course) => (
          <div
            key={course.id}
            className="bg-white shadow-md rounded-md cursor-pointer relative"
          >
            <div className="md:h-[200px] rounded-t-md group overflow-hidden">
              <img
                src={course.thumbnail}
                className="w-full object-cover rounded-t-md group-hover:scale-105 transition-animate"
              />
            </div>
            <div className="px-2 mb-5">
              <p className="mt-2 text-lg font-semibold">{course.name}</p>
              <p className="text-sm text-slate-600 flex justify-start mt-1 items-center">
                <UserIcon /> {course.instructor}
              </p>
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
            <span
              className={`px-3 py-1 text-xs rounded-full font-medium ${
                course.enrollmentStatus === "Open"
                  ? "bg-green-600"
                  : course.enrollmentStatus === "In Progress"
                  ? "bg-indigo-600"
                  : "bg-red-600"
              } text-white absolute top-4 right-4`}
            >
              {course.enrollmentStatus}
            </span>
          </div>
        ))}
      </div>
      {profileData.length === 0 && (
        <div className="flex justify-center items-center flex-col">
          <p className="text-center font-medium text-lg text-slate-700">
            No Enrolled Courses Found!
          </p>
          <Link
            to={"/"}
            className="rounded-md from-indigo-600 to-indigo-500 bg-gradient-to-br shadow-md shadow-indigo-400/40 px-4 py-2 mt-4 text-white text-sm font-medium mx-auto"
          >
            Explore Courses
          </Link>
        </div>
      )}
    </section>
  );
};

export default Profile;
