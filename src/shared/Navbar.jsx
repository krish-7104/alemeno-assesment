import { useEffect, useState } from "react";
import { BiMenu } from "react-icons/bi";
import { AiOutlineClose } from "react-icons/ai";
import {
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithPopup,
} from "firebase/auth";
import { auth } from "../firebase/config";

import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
const Navbar = () => {
  const [open, setOpen] = useState(false);
  const provider = new GoogleAuthProvider();
  const [login, setLogin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      if (!user) {
        setLogin(false);
      } else {
        setLogin(true);
      }
    });
  }, []);

  const googleLoginEventHandler = () => {
    toast.loading("Logging In");
    signInWithPopup(auth, provider)
      .then(() => {
        toast.dismiss();
        toast.success("Login Successfull");
        setLogin(true);
        navigate("/dashboard");
      })
      .catch((error) => {
        toast.dismiss();
        console.log(error);
        toast.error("Login Failed");
      });
  };
  return (
    <nav className="w-full bg-white flex justify-between items-center mx-auto px-8 py-4 shadow fixed top-0">
      <p className="font-bold text-xl text-purple-600">Alemeno Courses</p>
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
        <ul className="flex justify-center items-center md:mr-5 mb-5 md:mb-0 md:flex-row flex-col">
          <li className="font-normal text-[#3A3740] cursor-pointer p-2 mx-3">
            Home
          </li>
          <li className="font-normal text-[#3A3740] cursor-pointer p-2 mx-3">
            Flashcard
          </li>
          <li className="font-normal text-[#3A3740] cursor-pointer p-2 mx-3">
            Contact
          </li>
          <li className="font-normal text-[#3A3740] cursor-pointer p-2 mx-3">
            FAQ
          </li>
        </ul>
        {!login && (
          <button
            className="rounded-md from-purple-600 to-purple-500 bg-gradient-to-br shadow-md shadow-purple-400/40 px-4 py-2 text-white text-sm font-medium"
            onClick={googleLoginEventHandler}
          >
            Login with Google
          </button>
        )}
        {login && (
          <Link
            to={"/profile"}
            className="rounded-md from-purple-600 to-purple-500 bg-gradient-to-br shadow-md shadow-purple-400/40 px-4 py-2 text-white text-sm font-medium"
          >
            My Profile
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
