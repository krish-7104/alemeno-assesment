import Navbar from "./shared/Navbar";
import { Outlet } from "react-router-dom";

const Layout = () => {
  return (
    <section className="min-h-[100vh]">
      <Navbar />
      <Outlet />
    </section>
  );
};

export default Layout;
