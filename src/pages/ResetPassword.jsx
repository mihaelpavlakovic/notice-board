import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Nav from "../layouts/Nav";
import Card from "../utils/Card";
import { useDispatch, useSelector } from "react-redux";
import { resetPassword } from "../store/user/userActions";
import { selectEmailSent, selectStatus } from "../store/user/userSlice";

const ResetPassword = () => {
  const focusElement = useRef();
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const status = useSelector(selectStatus);
  const emailSent = useSelector(selectEmailSent);

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
      <div className="h-[90dvh] flex justify-center items-center">
        <Card>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4 w-[15rem] md:w-[25rem]"
          >
            <div className="text-gray-700">
              <h1 className="text-2xl pb-2">Ponovno postavite vašu lozinku</h1>
              <div className="mt-6">
                {emailSent && (
                  <p className="text-indigo-700 mb-2">
                    Uspješno je poslan mail. Provjerite ulaznu poštu.
                  </p>
                )}
                <div className="pb-4">
                  <label htmlFor="email">Email:</label>
                  <input
                    className="w-full rounded-md p-2 border-2 border-gray-500 focus:outline-none focus:border-indigo-700 focus:ring-indigo-700"
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
                  className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md w-full"
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
