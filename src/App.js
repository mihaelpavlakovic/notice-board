// react imports
import { BrowserRouter, Route, Routes } from "react-router-dom";

// component imports
import { useDispatch, useSelector } from "react-redux";
import { listenAuthState } from "./store/user/userActions";
import { useEffect } from "react";
import { selectUser, selectUserData } from "./store/user/userSlice";
import ProtectedRoute from "./routes/ProtectedRoute";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

function App() {
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const userData = useSelector(selectUserData);
  console.log("App ~ userData:", userData);
  console.log("App ~ user:", JSON.parse(user));

  useEffect(() => {
    dispatch(listenAuthState());
  }, [dispatch]);

  return (
    <div className="App">
      <BrowserRouter>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route element={<Feed />} path="/" exact />
            <Route element={<CreatePost />} path="/nova-objava" />
            <Route element={<Profile />} path="/profil" />
          </Route>
          <Route element={<Login />} path="/prijava" />
          <Route element={<Register />} path="/registracija" />
          <Route element={<NotFound />} path="/*" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
