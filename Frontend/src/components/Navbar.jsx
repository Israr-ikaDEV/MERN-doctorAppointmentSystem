import React, { useContext, useState } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../AppContext";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const logOut = () => {
    setToken(false);
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div>
      <div className="flex justify-between items-center text-sm py-4 mb-5 border-b border-b-gray-800">
        <img className="cursor-pointer w-44" src={assets.logo} alt="" />

        <ul className="hidden md:flex item-start gap-5 font-medium">
          <NavLink to="/">
            <li className="py-1">HOME</li>
            <hr className="border-none outline-none h-0.5 bg-primary m-auto hidden " />
          </NavLink>
          <NavLink to="/doctors">
            <li className="py-1">ALL DOCTORS</li>
            <hr className="border-none outline-none h-0.5 bg-primary m-auto hidden " />
          </NavLink>
          <NavLink to="/about">
            <li className="py-1">ABOUT</li>
            <hr className="border-none outline-none h-0.5 bg-primary m-auto  hidden" />
          </NavLink>
          <NavLink to="/contact">
            <li className="py-1">CONTACT</li>
            <hr className="border-none outline-none h-0.5 bg-primary m-auto  hidden" />
          </NavLink>
        </ul>

        <div className="flex items-center gap-4">
          {token && userData ? (
            <div className="flex items-center gap-2 group relative">
              <img className="w-9 rounded-full" src={userData.image} alt="" />
              <img className="w-2.5" src={assets.dropdown_icon} alt="" />
              <div className="absolute hidden group-hover:block text-gray-500 top-0 right-0 pt-14 z-20 text-base font-medium">
                <div className="min-w-48 bg-stone-200 flex flex-col gap-4 p-4 rounded">
                  <p
                    onClick={() => navigate("/my-profile")}
                    className="hover:text-black cursor-pointer"
                  >
                    My Profile
                  </p>
                  <p
                    onClick={() => navigate("/my-appointments")}
                    className="hover:text-black cursor-pointer"
                  >
                    My Appointments
                  </p>
                  <p
                    onClick={logOut}
                    className="hover:text-black cursor-pointer"
                  >
                    Logout
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                navigate("/login"); // This will navigate to the login page
              }}
              className="bg-primary py-3 px-8 rounded-full text-white font-light hidden md:block"
            >
              Login/SignUp
            </button>
          )}
        </div>

        <img
          onClick={() => setShowMenu(true)}
          className="md:hidden w-6"
          src={assets.menu_icon}
          alt=""
        />

        {/* ---------mobile menu------- */}
        <div
          className={`${
            showMenu ? "fixed w-full" : "h-0 w-0"
          } md:hidden right-0 top-0 bottom-0 bg-white z-20 overflow-hidden transition-all duration-300`}
        >
          <div className="flex items-center justify-between px-5 py-6">
            <img className="w-36" src={assets.logo} alt="" />
            <img
              onClick={() => setShowMenu(false)}
              className="w-6"
              src={assets.cross_icon}
              alt=""
            />
          </div>
          <ul className="flex flex-col items-center gap-2 mt-5 px-5 text-lg font-medium">
            <NavLink
              className="px-4 py-2 rounded inline-block "
              onClick={() => setShowMenu(false)}
              to="/"
            >
              HOME
            </NavLink>
            <NavLink
              className="px-4 py-2 rounded inline-block "
              onClick={() => setShowMenu(false)}
              to="/doctors"
            >
              ALL DOCTORS
            </NavLink>
            <NavLink
              className="px-4 py-2 rounded inline-block "
              onClick={() => setShowMenu(false)}
              to="/about"
            >
              ABOUT
            </NavLink>
            <NavLink
              className="px-4 py-2 rounded inline-block "
              onClick={() => setShowMenu(false)}
              to="/contact"
            >
              CONTACT
            </NavLink>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
