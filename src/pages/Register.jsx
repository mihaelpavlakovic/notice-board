// react imports
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/user/userActions";

// component imports
import Nav from "../layouts/Nav";
import Card from "../utils/Card";
import { selectStatus, selectUser } from "../store/user/userSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const focusElement = useRef();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const fileInputRef = useRef(null);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const status = useSelector(selectStatus);
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

    dispatch(register({ email, password, name, profilePicture }));
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
    setName("");
    setProfilePicture("");
    fileInputRef.current.value = null;
  };

  return (
    <>
      <Nav />

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
              <label htmlFor="name">Ime i prezime:</label>
              <input
                className="w-full border rounded-md p-2"
                id="name"
                name="name"
                value={name}
                onChange={e => setName(e.target.value)}
                type="text"
                required
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profilePicture">Select a file:</label>
              {profilePicture && (
                <div className="flex flex-col items-center gap-1 w-[20rem] relative">
                  <img
                    src={URL.createObjectURL(profilePicture)}
                    alt="Selected"
                    className="border w-full"
                  />
                  <button
                    onClick={() => {
                      setProfilePicture("");
                      fileInputRef.current.value = null;
                    }}
                    className="absolute top-3 right-3 bg-white hover:bg-indigo-600 text-indigo-600 font-semibold hover:text-white py-2 px-4 border border-indigo-600 hover:border-transparent rounded"
                  >
                    Ukloni
                  </button>
                </div>
              )}
              <input
                className="w-full border rounded-md p-2"
                type="file"
                id="profilePicture"
                name="profilePicture"
                ref={fileInputRef}
                onChange={e => setProfilePicture(e.target.files[0])}
                accept="image/*"
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
                // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                // title="Mora sadržavati najmanje jedan broj i jedno veliko i malo slovo te najmanje 8 ili više znakova"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="passwordConfirm">Potvrdi lozinku:</label>
              <input
                className="w-full border rounded-md p-2"
                id="passwordConfirm"
                name="passwordConfirm"
                value={passwordConfirm}
                onChange={e => setPasswordConfirm(e.target.value)}
                type="password"
                required
                // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                // title="Mora sadržavati najmanje jedan broj i jedno veliko i malo slovo te najmanje 8 ili više znakova"
              />
            </div>

            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 px-4 rounded-md"
            >
              {status === "loading" ? "U tijeku..." : "Registracija"}
            </button>
          </form>
        </Card>
      </div>
    </>
  );
};

export default Register;
