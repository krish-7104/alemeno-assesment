import { useEffect, useState } from "react";
import { BiMenu } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
  signOut, // Import signOut from firebase/auth
} from "firebase/auth";
import { auth } from "../firebase/config";

import toast from "react-hot-toast";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { login, logout } from "../redux/userSlice";

const Navbar = () => {
  const [open, setOpen] = useState(false);
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
      .then(() => {
        toast.dismiss();
        toast.success("Login Successfull");
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
  console.log(data);
  return (
    <nav className="w-full bg-white flex justify-between items-center mx-auto px-8 py-4 shadow fixed top-0 z-30">
      <Link to={"/"} className="font-bold text-xl text-indigo-600">
        Alemeno Courses
      </Link>
      {open && (
        <AiOutlineClose
          size={24}
          className="relative z-30 md:hidden block"
          onClick={() => setOpen(false)}
        />
      )}
      {!open && (
        <BiMenu
          size={26}
          className="relative z-30 md:hidden block"
          onClick={() => setOpen(true)}
        />
      )}
      <div
        className={` ${
          open ? "flex" : "hidden md:flex"
        } justify-center items-center md:flex-row flex-col bg-white h-[100vh] absolute md:static top-0 w-full md:h-auto md:w-auto left-0 z-10`}
      >
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
            <button
              className="rounded-md from-red-600 to-red-500 bg-gradient-to-br shadow-md shadow-indigo-400/40 px-4 py-2 text-white text-sm font-medium ml-4"
              onClick={logoutHandler}
            >
              Logout
            </button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
