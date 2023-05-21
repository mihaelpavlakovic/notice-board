import React, { useRef, useState } from "react";

// component imports
import Nav from "../layouts/Nav";
import { useDispatch, useSelector } from "react-redux";
import {
  resetUploadProgress,
  selectProgress,
  selectStatus,
  selectUserData,
} from "../store/user/userSlice";
import { updateProfilePicture } from "../store/user/userActions";
import Modal from "../utils/Modal";

const Profile = () => {
  const userData = useSelector(selectUserData);
  const status = useSelector(selectStatus);
  const uploadProgress = useSelector(selectProgress);
  const [display, setDisplay] = useState(false);
  const [displayProgress, setDisplayProgress] = useState(false);
  const [error, setError] = useState("");
  const [image, setImage] = useState(null);
  const dispatch = useDispatch();
  const refValue = useRef();
  const types = ["image/png", "image/jpeg", "image/jpg"];

  const reset = () => {
    setDisplayProgress(false);
    refValue.current.value = "";
    setImage(null);
    dispatch(resetUploadProgress());
    // dispatch(databaseActions.removeImage());
  };

  const handleSelect = e => {
    let selected = e.target.files[0];

    if (selected && types.includes(selected.type)) {
      setImage(selected);
      setError("");
    } else {
      setError("Odaberite sliku formata .png, .jpeg ili .jpg");
      reset();
    }
  };

  const uploadImageHandler = () => {
    setDisplayProgress(true);
    dispatch(updateProfilePicture(image)).then(() => {
      if (status === "succeeded") {
        reset();
      }
    });
  };

  return (
    <>
      <Nav />
      <main className="xl:max-w-7xl xl:mx-auto max-w-full m-5 sm:px-[8%]">
        {display && (
          <Modal
            type={"user"}
            isOpen={display}
            index={""}
            itemId={""}
            data={""}
            onClose={() => setDisplay(false)}
          />
        )}
        <div className="flex flex-col gap-4">
          <h1 className="text-3xl mb-5 font-semibold">Osobne informacije</h1>
          <div className="border-2 border-solid rounded-md">
            <p className="text-lg p-3 border-b-2">Slika profila</p>
            <div className="flex flex-col md:flex-row items-center">
              <div className="w-full flex items-center justify-center">
                <img
                  className="p-3 lg:w-[70%]"
                  src={userData?.photoURL}
                  alt="Slika profila"
                />
              </div>
              <form className="p-5 w-full">
                <label
                  htmlFor="fileInput"
                  className="text-sm mb-4 flex items-center"
                >
                  Odaberite sliku profila:
                </label>
                {error && (
                  <p className="bg-red-500 text-white rounded p-2 mt-2 text-sm">
                    {error}
                  </p>
                )}
                <input
                  type="file"
                  id="fileInput"
                  name="fileInput"
                  ref={refValue}
                  onChange={handleSelect}
                  className="w-full text-sm sm:text-md py-5"
                />
                {image !== null && (
                  <div className="flex flex-col mt-3">
                    {displayProgress && (
                      <div className="h-4 bg-indigo-200 rounded">
                        <div
                          className="h-full bg-indigo-600 rounded"
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                    <div className="mt-3 flex flex-col gap-2 md:flex-row justify-between">
                      <button
                        type="button"
                        className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-md w-full p-1 mt-2"
                        onClick={uploadImageHandler}
                      >
                        Primjeni
                      </button>
                      <button
                        type="button"
                        className="bg-white hover:font-bold text-indigo-700 font-semibold rounded-md border-2 border-indigo-700 w-full p-1 mt-2"
                        onClick={reset}
                      >
                        Odustani
                      </button>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>
          <div className="flex flex-col lg:flex-row justify-center gap-4">
            <div className="border-2 border-solid rounded-md w-full">
              <div className="p-3 border-b-2 flex justify-between items-center">
                <h2 className="text-lg">Info</h2>
                <button type="button" onClick={() => setDisplay(true)}>
                  Uredi
                </button>
              </div>
              <div className="flex flex-col gap-3 p-3">
                <p>Ime i prezime: {userData?.displayName}</p>
                <p>Email: {userData?.email}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default Profile;
