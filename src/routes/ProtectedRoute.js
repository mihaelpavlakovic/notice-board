import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { selectIsLoading, selectUser } from "../store/user/userSlice";
import Spinner from "../utils/Spinner";

const ProtectedRoute = () => {
  const user = useSelector(selectUser);
  const isLoading = useSelector(selectIsLoading);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spinner />
      </div>
    );
  }

  return user ? <Outlet /> : <Navigate to="/prijava" />;
};

export default ProtectedRoute;
