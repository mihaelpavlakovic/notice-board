// react imports
import React from "react";
import { Outlet } from "react-router-dom";

//component imports
import Nav from "./Nav";
import Footer from "./Footer";

const Main = () => {
  return (
    <div>
      <Nav />
      <main>
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default Main;
