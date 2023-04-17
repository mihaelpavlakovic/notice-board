// react imports
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectUser } from "../store/user/userSlice";

// library imports
import { Bars3Icon } from "@heroicons/react/24/outline";
import { logout } from "../store/user/userActions";

const Nav = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector(selectUser);

  let content;
  if (user) {
    content = (
      <>
        <li>
          <Link
            to="/"
            className="lg:px-5 py-1 block"
            style={{
              fontWeight: location.pathname === "/" ? "700" : "",
            }}
          >
            Naslovna
          </Link>
        </li>
        <li>
          <Link
            to="/nova-objava"
            className="lg:px-5 py-1 block"
            style={{
              fontWeight: location.pathname === "/nova-objava" ? "700" : "",
            }}
          >
            Nova Objava
          </Link>
        </li>
        <li>
          <Link
            to="/profil"
            className="lg:px-5 py-1 block"
            style={{
              fontWeight: location.pathname === "/profil" ? "700" : "",
            }}
          >
            Profil
          </Link>
        </li>
        <li>
          <Link
            to="/prijava"
            className="lg:px-5 py-1 block"
            onClick={() => dispatch(logout())}
          >
            Odjava
          </Link>
        </li>
      </>
    );
  } else {
    content = (
      <>
        <li>
          <Link
            to="/prijava"
            className="lg:px-5 py-1 block"
            style={{
              fontWeight: location.pathname === "/prijava" ? "700" : "",
            }}
          >
            Prijava
          </Link>
        </li>
        <li>
          <Link
            to="/registracija"
            className="lg:px-5 py-1 block"
            style={{
              fontWeight: location.pathname === "/registracija" ? "700" : "",
            }}
          >
            Registracija
          </Link>
        </li>
      </>
    );
  }

  return (
    <header className="bg-indigo-600 p-4 text-slate-100">
      <div className="flex items-center justify-between xl:max-w-7xl xl:mx-auto max-w-full px-[8%] flex-wrap">
        <Link to="/" className="text-2xl font-semibold">
          Notice Board
        </Link>
        <Bars3Icon
          className="lg:hidden block h-6 w-6 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        />
        <nav
          className={`${
            isOpen ? "block mt-5" : "hidden"
          } w-full lg:flex lg:w-auto`}
        >
          <ul className="text-base lg:flex lg:justify-between lg:items-center text-center">
            {content}
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Nav;
