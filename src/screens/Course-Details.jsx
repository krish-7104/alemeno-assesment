import { doc, getDoc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import { useParams } from "react-router-dom";
const CourseDetails = () => {
  const { id } = useParams();
  const [data, setData] = useState();
  const [loading, setLoading] = useState(false);
  const getCourseById = async () => {
    try {
      const courseDocRef = doc(db, "courses", id);
      const courseSnapshot = await getDoc(courseDocRef);
      if (courseSnapshot.exists()) {
        const courseData = courseSnapshot.data();
        setData(courseData);
      } else {
        console.log("No such document!");
        return null;
      }
    } catch (error) {
      console.error("Error getting document:", error);
      return null;
    }
  };
  useEffect(() => {
    getCourseById();
  }, []);
  return (
    <section className="max-h-[100vh] overflow-hidden bg-gray-100">
      {data && (
        <section className="flex justify-evenly h-screen">
          <div className="w-[35%] sticky top-28 pt-28 flex justify-start items-start flex-col px-10">
            <p className="mb-4 font-semibold text-2xl border-l-8 border-l-purple-600 pl-2">
              Course Details
            </p>
            <img
              src={data.thumbnail}
              width={420}
              className="rounded-md shadow-md shadow-purple-600/30"
            />
            <p className="font-semibold text-2xl mt-4">{data.name}</p>
            <p className="text-lg mt-1">{data.instructor}</p>
            <p className="mt-1">{data.description}</p>
          </div>
          <div className="w-[65%] overflow-y-scroll pt-28 courseDetail bg-white p-10">
            <img
              src={data.thumbnail}
              width={420}
              className="rounded-md shadow-md shadow-purple-600/30"
            />
            <p className="font-semibold text-2xl mt-4">{data.name}</p>
            <p className="text-lg mt-1">{data.instructor}</p>
            <p className="mt-1">{data.description}</p>
            <img
              src={data.thumbnail}
              width={420}
              className="rounded-md shadow-md shadow-purple-600/30"
            />
            <p className="font-semibold text-2xl mt-4">{data.name}</p>
            <p className="text-lg mt-1">{data.instructor}</p>
            <p className="mt-1">{data.description}</p>
            <img
              src={data.thumbnail}
              width={420}
              className="rounded-md shadow-md shadow-purple-600/30"
            />
            <p className="font-semibold text-2xl mt-4">{data.name}</p>
            <p className="text-lg mt-1">{data.instructor}</p>
            <p className="mt-1">{data.description}</p>
            v
            <img
              src={data.thumbnail}
              width={420}
              className="rounded-md shadow-md shadow-purple-600/30"
            />
            <p className="font-semibold text-2xl mt-4">{data.name}</p>
            <p className="text-lg mt-1">{data.instructor}</p>
            <p className="mt-1">{data.description}</p>
            <img
              src={data.thumbnail}
              width={420}
              className="rounded-md shadow-md shadow-purple-600/30"
            />
            <p className="font-semibold text-2xl mt-4">{data.name}</p>
            <p className="text-lg mt-1">{data.instructor}</p>
            <p className="mt-1">{data.description}</p>
          </div>
        </section>
      )}
    </section>
  );
};

export default CourseDetails;
