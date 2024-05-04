import { useEffect, useState } from "react";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut,
} from "firebase/auth";
import { auth, db } from "../firebase/config";

import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/userSlice";
import { doc, getDoc, setDoc } from "firebase/firestore";

const Navbar = () => {
  const location = useLocation();
  const provider = new GoogleAuthProvider();
  const navigate = useNavigate();
  const data = useSelector((state) => state);
  const dispatch = useDispatch();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        dispatch(logout());
      } else {
        const { email, displayName, uid, photoURL } = user;
        dispatch(login({ id: uid, user: { email, displayName, photoURL } }));
      }
    });
  }, [dispatch]);

  const googleLoginEventHandler = () => {
    toast.loading("Logging In");
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        const userId = user.uid;
        const studentRef = doc(db, "students", userId);
        getDoc(studentRef).then((docSnapshot) => {
          if (!docSnapshot.exists()) {
            setDoc(studentRef, { courses: [], likes: [] })
              .then(() => {
                toast.dismiss();
                toast.success("Login Successful");
              })
              .catch((error) => {
                console.error("Error creating document: ", error);
                toast.dismiss();
                toast.error("Login Failed");
              });
          } else {
            toast.dismiss();
            toast.success("Login Successful");
          }
        });
      })
      .catch((error) => {
        toast.dismiss();
        console.log(error);
        toast.error("Login Failed");
      });
  };

  const logoutHandler = () => {
    signOut(auth)
      .then(() => {
        toast.success("Logout Successful");
        dispatch(logout());
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout Error:", error);
        toast.error("Logout Failed");
      });
  };

  return (
    <nav className="w-full bg-white flex justify-between items-center mx-auto px-8 py-4 shadow fixed top-0 z-30">
      <Link to={"/"} className="font-bold text-xl text-indigo-600">
        Alemeno Courses
      </Link>
      {data && !data?.user?.id && (
        <button
          className="rounded-md from-indigo-600 to-indigo-500 bg-gradient-to-br shadow-md shadow-indigo-400/40 px-4 py-2 text-white text-sm font-medium"
          onClick={googleLoginEventHandler}
        >
          Login with Google
        </button>
      )}
      {data && data?.user?.id && (
        <>
          {location.pathname !== "/profile" && (
            <Link
              to={"/profile"}
              className="rounded-md from-indigo-600 to-indigo-500 bg-gradient-to-br shadow-md shadow-indigo-400/40 px-4 py-2 text-white text-sm font-medium"
            >
              My Profile
            </Link>
          )}
          {location.pathname === "/profile" && (
            <button
              className="rounded-md from-red-600 to-red-500 bg-gradient-to-br shadow-md shadow-indigo-400/40 px-4 py-2 text-white text-sm font-medium ml-4"
              onClick={logoutHandler}
            >
              Logout
            </button>
          )}
        </>
      )}
    </nav>
  );
};

export default Navbar;
