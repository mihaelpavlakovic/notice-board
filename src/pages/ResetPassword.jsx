import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../layouts/Nav";
import Card from "../utils/Card";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../store/user/userActions";
import { selectStatus } from "../store/user/userSlice";

const ResetPassword = () => {
  const focusElement = useRef();
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);

  useEffect(() => {
    focusElement.current.focus();
  }, []);

  const handleSubmit = e => {
    e.preventDefault();

    dispatch(resetPassword(email));
  };

  return (
    <>
      <Nav />
      <div className="h-[40rem] flex justify-center items-center">
        <Card>
          <form onSubmit={handleSubmit} className="w-full flex flex-col gap-4">
            <div className="text-gray-700 p-5 sm:p-10 md:p-20">
              <h1 className="text-3xl pb-2">Ponovno postavite vašu lozinku</h1>
              <div className="mt-6">
                <div className="pb-4">
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
                <button
                  type="submit"
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
                >
                  {status === "loading" ? "U tijeku..." : "Pošalji zahtjev"}
                </button>
                <p className="text-center text-gray-500 text-sm mt-5">
                  <Link
                    to="/prijava"
                    className="text-indigo-700 hover:underline"
                  >
                    Povratak
                  </Link>
                </p>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </>
  );
};

export default ResetPassword;
