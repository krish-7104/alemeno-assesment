import { useSelector } from "react-redux";
import CourseCard from "../components/CourseCard";
import { useEffect, useState } from "react";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/config";
import { Link, useNavigate } from "react-router-dom";
import ProfileCard from "../components/ProfileCard";
import Loading from "../components/Loading";

const Profile = () => {
  const { user, id } = useSelector((state) => state.user);
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState([]);
  const [loading, setLoading] = useState(true);
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
          setLoading(false);
        }
      } catch (error) {
        setLoading(false);
        console.error("Error fetching profile data:", error);
      }
    };

    fetchCourses();
  }, [id]);

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
      {loading && <Loading />}
      <div className="md:grid md:grid-cols-3 gap-6 w-[90%] mx-auto my-10 flex flex-wrap">
        {profileData.map((course) => (
          <ProfileCard key={course.id} course={course} />
        ))}
      </div>
      {!loading && profileData.length === 0 && (
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
