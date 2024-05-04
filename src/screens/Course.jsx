import React, { useState, useEffect } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import CourseCard from "../components/CourseCard";
import { AiOutlineClose } from "react-icons/ai";
import NoDataSvg from "../assets/no-data.svg";
import Loading from "../components/Loading";
const Course = () => {
  const [searchText, setSearchText] = useState("");
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "courses"));
        const coursesData = [];
        querySnapshot.forEach((doc) => {
          coursesData.push({ id: doc.id, ...doc.data() });
        });
        setCourses(coursesData);
        setFilteredCourses(coursesData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching courses:", error);
      }
    };

    fetchCourses();
  }, []);

  useEffect(() => {
    const filtered = courses.filter(
      (course) =>
        course.name.toLowerCase().includes(searchText.toLowerCase()) ||
        course.instructor.toLowerCase().includes(searchText.toLowerCase())
    );
    setFilteredCourses(filtered);
  }, [courses, searchText]);

  return (
    <section className="min-h-[90vh] pt-24">
      <p className="text-4xl font-semibold text-center my-10">Our Courses</p>
      <div className="flex justify-center items-center relative w-[35%] mx-auto">
        <input
          type="text"
          value={searchText}
          placeholder="Enter Course Title or Instructor..."
          onChange={(e) => setSearchText(e.target.value)}
          className="bg-slate-200/50 px-4 py-3 rounded-full w-full outline-none border caret-indigo-600 text-sm"
        />
        {searchText && (
          <AiOutlineClose
            className="absolute right-4 text-xl text-indigo-600 cursor-pointer"
            onClick={() => setSearchText("")}
          />
        )}
      </div>
      {loading && <Loading />}
      <div className="grid grid-cols-3 gap-6 w-[90%] mx-auto my-10">
        {filteredCourses.map((course) => (
          <CourseCard
            key={course.id}
            name={course.name}
            instructor={course.instructor}
            image={course.thumbnail}
            status={course.enrollmentStatus}
            students={course?.students}
            courseId={course.id}
          />
        ))}
      </div>
      {!loading && filteredCourses.length === 0 && (
        <div className="flex flex-col justify-center items-center">
          <img src={NoDataSvg} width={180} />
          <p className="text-center text-xl mt-6">No Courses Found!</p>
        </div>
      )}
    </section>
  );
};

export default Course;
