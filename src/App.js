// react imports
import { createBrowserRouter, RouterProvider } from "react-router-dom";

// component imports
import Main from "./layouts/Main";
import Feed from "./pages/Feed";
import Error from "./pages/Error";

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
        path: "profil",
        element: <p>Profil page</p>,
        errorElement: <Error />,
      },
    ],
  },
]);

function App() {
  return (
    <div className="App">
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
