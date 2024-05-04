import { doc, arrayUnion, getDoc, updateDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { Link, useParams } from "react-router-dom";
import { UserIcon } from "../components/UserIcon";
import Accordian from "../components/Accordian";
import { useSelector } from "react-redux";
import NoDataSvg from "../assets/no-data.svg";
import toast from "react-hot-toast";
import Loading from "../components/Loading";
import { BiChevronLeft } from "react-icons/bi";

const CourseDetails = () => {
  const params = useParams();
  const { user, id } = useSelector((state) => state.user);
  const [data, setData] = useState();
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState();
  useEffect(() => {
    getCourseById();
  }, [params.id]);

  const getCourseById = async () => {
    try {
      const courseDocRef = doc(db, "courses", params.id);
      const courseSnapshot = await getDoc(courseDocRef);
      if (courseSnapshot.exists()) {
        const courseData = courseSnapshot.data();
        setData(courseData);
        setLoading(false);
      } else {
        toast.dismiss();
        setLoading(false);
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  };

  const enrollStudentToCourse = async () => {
    if (id) {
      try {
        toast.loading("Enrolling...");
        const courseRef = doc(db, "courses", params.id);
        await updateDoc(courseRef, {
          students: arrayUnion(id),
        });
        const studentRef = doc(db, "students", id);
        await updateDoc(studentRef, {
          courses: arrayUnion({
            courseId: params.id,
            progress: 0,
            completed: false,
          }),
        });
        toast.dismiss();
        toast.success("You Are Enrolled!");
        getCourseById();
      } catch (error) {
        toast.dismiss();
        toast.error("Try Again Later!");
        console.error("Error enrolling student:", error);
      }
    } else {
      toast.dismiss();
      toast.error("Login with Google First!");
    }
  };

  return (
    <section className="max-h-[100vh] md:overflow-hidden bg-slate-100">
      {!loading && data && (
        <section className="flex justify-evenly h-screen flex-col md:flex-row">
          <div className="md:w-[35%] w-full md:sticky md:top-28 pt-24 flex justify-start items-start flex-col px-10 md:overflow-y-scroll courseDetail">
            <Link
              to="/"
              className="mb-3 rounded-lg text-indigo-600 p-1 cursor-pointer hover:bg-indigo-600 hover:text-white transition-animate"
            >
              <BiChevronLeft size={28} />
            </Link>
            <img
              src={data.thumbnail}
              width={420}
              className="rounded-md shadow-md shadow-indigo-600/30"
            />
            <div className="my-5">
              <p className="font-semibold text-2xl">{data.name}</p>
              <p className="mt-2 flex justify-start items-center text-slate-800">
                <UserIcon /> {data.instructor}
              </p>
              <p className="mt-2 text-slate-700 text-sm">{data.description}</p>
            </div>
          </div>
          <div className="md:w-[65%] w-full md:overflow-y-scroll md:pt-24 courseDetail bg-white p-8">
            <div className="flex justify-evenly items-center mb-6 bg-slate-100 p-4 border">
              <div className="w-full flex justify-center items-center flex-col">
                <p className="font-semibold text-sm mb-2">Duration</p>
                <p>{data.duration}</p>
              </div>
              <span className="h-[50px] bg-indigo-600 p-[1px] rounded-full"></span>
              <div className="w-full flex justify-center items-center flex-col">
                <p className="font-semibold text-sm mb-2">Location</p>
                <p>{data.location}</p>
              </div>
              <span className="h-[50px] bg-indigo-600 p-[1px] rounded-full"></span>
              <div className="w-full flex justify-center items-center flex-col">
                <p className="font-semibold text-sm mb-2">Enrollment Status</p>
                <p>{data.enrollmentStatus}</p>
              </div>
              <span className="h-[50px] bg-indigo-600 p-[1px] rounded-full"></span>
              <div className="w-full flex justify-center items-center flex-col">
                <p className="font-semibold text-sm mb-2">Enrolled Students</p>
                <p>{data?.students?.length ? data?.students?.length : 0}</p>
              </div>
            </div>
            <div className="mb-5">
              <p className="font-semibold text-sm flex justify-start items-center text-indigo-600">
                Schedule
              </p>
              <p>{data.schedule}</p>
            </div>
            <div className="mb-5">
              <p className="font-semibold text-sm flex justify-start items-center text-indigo-600">
                Prerequisites
              </p>
              <div className="mt-2 gap-4 flex flex-wrap">
                {data.prerequisites.map((item) => (
                  <span
                    key={item + data.name}
                    className="text-xs border px-4 py-1 rounded-full"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
            <div className="mb-4">
              <p className="font-semibold text-sm flex justify-start items-center text-indigo-600 mb-3">
                Syllabus
              </p>
              {data.syllabus.map((item, index) => (
                <Accordian
                  key={"accordian" + index}
                  index={index}
                  open={open}
                  setOpen={setOpen}
                  topic={item.topic}
                  week={item.week}
                  content={item.content}
                />
              ))}
            </div>
            {data.enrollmentStatus !== "Closed" &&
              !data.students.includes(id) && (
                <button
                  className="rounded-md block mx-auto w-[50%] md:w-[26%] from-indigo-600 to-indigo-600 bg-gradient-to-br shadow-md shadow-indigo-400/40 px-4 py-2 text-white font-medium mt-10"
                  onClick={enrollStudentToCourse}
                >
                  Enroll Now
                </button>
              )}
            {data.enrollmentStatus !== "Closed" &&
              data.students.includes(id) && (
                <p className="rounded-md block mx-auto w-[50%] md:w-[26%] shadow-md bg-slate-700 px-4 py-2 text-white font-medium mt-10 text-center">
                  Already Enrolled
                </p>
              )}
          </div>
        </section>
      )}
      {!loading && !data && (
        <div className="flex flex-col justify-center items-center min-h-[100vh]">
          <img src={NoDataSvg} width={300} />
          <p className="text-center text-xl mt-10">No Courses Found!</p>
        </div>
      )}
      {loading && (
        <div className="flex flex-col justify-center items-center min-h-[100vh]">
          <Loading />
        </div>
      )}
    </section>
  );
};

export default CourseDetails;
