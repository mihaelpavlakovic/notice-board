// react imports
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../store/user/userActions";
import { useNavigate } from "react-router-dom";

// component imports
import Card from "../utils/Card";
import { selectUser } from "../store/user/userSlice";

const Login = () => {
  const focusElement = useRef();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
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
    <div className="h-[40rem] flex justify-center items-center">
      <Card>
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
            Prijava
          </button>
        </form>
      </Card>
    </div>
  );
};

export default Login;
