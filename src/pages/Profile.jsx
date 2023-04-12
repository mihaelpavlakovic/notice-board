import React from "react";

// component imports
import Nav from "../layouts/Nav";
import { useSelector } from "react-redux";
import { selectStatus, selectUserData } from "../store/user/userSlice";

const Profile = () => {
  const userData = useSelector(selectUserData);
  const status = useSelector(selectStatus);

  return (
    <>
      <Nav />
      <div>
        <h1>Profil</h1>
        {status === "loading" ? (
          "Loading..."
        ) : (
          <>
            <p>{userData.email}</p>
            <p>{userData.displayName}</p>
            <img className="w-[20rem]" src={userData.photoURL} alt="Profile" />
          </>
        )}
      </div>
    </>
  );
};

export default Profile;
