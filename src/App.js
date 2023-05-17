// react imports
import { BrowserRouter, Route, Routes } from "react-router-dom";

// component imports
import { useDispatch } from "react-redux";
import { listenAuthState } from "./store/user/userActions";
import { useEffect } from "react";
import ProtectedRoute from "./routes/ProtectedRoute";
import Feed from "./pages/Feed";
import CreatePost from "./pages/CreatePost";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";
import ResetPassword from "./pages/ResetPassword";

function App() {
  const dispatch = useDispatch();

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
          <Route element={<ResetPassword />} path="/promjena-lozinke" />
          <Route element={<NotFound />} path="/*" />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
