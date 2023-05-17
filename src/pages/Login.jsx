// react imports
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/user/userActions";
import { Link, useNavigate } from "react-router-dom";

// component imports
import Nav from "../layouts/Nav";
import Card from "../utils/Card";
import {
  selectError,
  selectHasError,
  selectStatus,
  selectUser,
} from "../store/user/userSlice";

const Login = () => {
  const focusElement = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const status = useSelector(selectStatus);
  const hasError = useSelector(selectHasError);
  const error = useSelector(selectError);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  useEffect(() => {
    focusElement.current.focus();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();

    dispatch(login({ email, password }));
    setEmail("");
    setPassword("");
  };

  return (
    <>
      <Nav />
      <div className="h-[40rem] flex justify-center items-center">
        <Card>
          {hasError && (
            <div>
              <p className="text-red-400 mb-2">{error.errorMessage}</p>
            </div>
          )}
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="email">Email:</label>
              <input
                className="w-full border rounded-md p-2"
                id="email"
                name="email"
                ref={focusElement}
                value={email}
                onChange={e => setEmail(e.target.value)}
                type="email"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="password">Lozinka:</label>
              <input
                className="w-full border rounded-md p-2"
                id="password"
                name="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                type="password"
                required
              />
            </div>
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              {status === "loading" ? "U tijeku..." : "Prijava"}
            </button>
            <Link
              to="/promjena-lozinke"
              className="text-indigo-700 hover:underline"
            >
              Ponovno postavi lozinku
            </Link>
          </form>
        </Card>
      </div>
    </>
  );
};

export default Login;
