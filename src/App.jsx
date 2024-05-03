import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout";
import Course from "./screens/Course";
import CourseDetail from "./screens/Course-Details";
import Profile from "./screens/Profile";
const App = () => {
  const router = createBrowserRouter([
    {
      path: "/",
      Component: Layout,
      children: [
        {
          path: "/",
          Component: Course,
        },
        {
          path: "/course/:id",
          Component: CourseDetail,
        },
        {
          path: "/profile",
          Component: Profile,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
