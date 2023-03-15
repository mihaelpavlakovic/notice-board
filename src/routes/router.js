// react imports
import { createBrowserRouter } from "react-router-dom";

// component imports
import Main from "../layouts/Main";
import Feed from "../pages/Feed";
import Error from "../pages/Error";
import CreatePost from "../pages/CreatePost";
import Profile from "../pages/Profile";
import Login from "../pages/Login";
import Register from "../pages/Register";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: <Feed />,
        errorElement: <Error />,
      },
      {
        path: "nova-objava",
        element: <CreatePost />,
        errorElement: <Error />,
      },
      {
        path: "profil",
        element: <Profile />,
        errorElement: <Error />,
      },
      {
        path: "prijava",
        element: <Login />,
        errorElement: <Error />,
      },
      {
        path: "registracija",
        element: <Register />,
        errorElement: <Error />,
      },
    ],
  },
]);

export default router;
