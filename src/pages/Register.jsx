// react imports
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { register } from "../store/user/userActions";

// component imports
import Nav from "../layouts/Nav";
import Card from "../utils/Card";
import {
  resetUploadProgress,
  selectError,
  selectHasError,
  selectProgress,
  selectStatus,
  selectUser,
} from "../store/user/userSlice";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const focusElement = useRef();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [nameError, setNameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const fileInputRef = useRef(null);
  const hasError = useSelector(selectHasError);
  const error = useSelector(selectError);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);
  const status = useSelector(selectStatus);
  const navigate = useNavigate();
  const uploadProgress = useSelector(selectProgress);
  const [displayProgress, setDisplayProgress] = useState(false);
  const [imageTypeError, setImageTypeError] = useState("");
  const types = ["image/png", "image/jpeg", "image/jpg"];

  useEffect(() => {
    if (user && status === "succeeded" && uploadProgress === 100) {
      navigate("/");
      dispatch(resetUploadProgress());
    }
  }, [user, status, uploadProgress, navigate, dispatch]);

  useEffect(() => {
    focusElement.current.focus();
  }, []);

  const handleSelect = e => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setProfilePicture(selected);
      setImageTypeError("");
    } else {
      setImageTypeError("Odaberite sliku formata .png, .jpeg ili .jpg");
      fileInputRef.current.value = "";
      setProfilePicture("");
      dispatch(resetUploadProgress());
    }
  };

  const handleSubmit = e => {
    e.preventDefault();

    let isValid = true;

    // Reset error messages
    setNameError("");
    setPasswordError("");
    setConfirmPasswordError("");

    // Name validation
    if (name.length > 40) {
      setNameError("Ime i prezime ne smije biti duže od 40 znakova.");
      isValid = false;
    }

    // Password validation
    const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

    if (!passwordRegex.test(password)) {
      setPasswordError(
        "Lozinka mora sadržavati najmanje 8 znakova, jedno veliko slovo, jedno malo slovo i jedan broj."
      );
      isValid = false;
    }

    // Password validation
    if (password !== passwordConfirm) {
      setConfirmPasswordError("Lozinke se ne podudaraju.");
      isValid = false;
    }

    if (isValid) {
      setDisplayProgress(true);
      dispatch(register({ email, password, name, profilePicture }));
      setEmail("");
      setPassword("");
      setPasswordConfirm("");
      setName("");
      setProfilePicture("");
      fileInputRef.current.value = null;
    }
  };

  return (
    <>
      <Nav />

      <div className="flex justify-center items-center py-5">
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
              {nameError && <span className="text-red-500">{nameError}</span>}
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="profilePicture">Odaberi sliku profila:</label>
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
              {imageTypeError && (
                <p className="bg-red-500 text-white rounded p-2 mt-2 text-sm">
                  {imageTypeError}
                </p>
              )}
              <input
                className="w-full border rounded-md p-2"
                type="file"
                id="profilePicture"
                name="profilePicture"
                ref={fileInputRef}
                onChange={handleSelect}
                accept="image/*"
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
                // pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                // title="Mora sadržavati najmanje jedan broj i jedno veliko i malo slovo te najmanje 8 ili više znakova"
              />
              {passwordError && (
                <span className="text-red-500">{passwordError}</span>
              )}
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
              />
              {confirmPasswordError && (
                <span className="text-red-500">{confirmPasswordError}</span>
              )}
            </div>

            {displayProgress && (
              <div className="h-4 bg-indigo-200 rounded">
                <div
                  className="h-full bg-indigo-600 rounded"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            )}

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
