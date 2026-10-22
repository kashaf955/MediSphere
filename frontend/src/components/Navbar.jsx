import React from "react";
import { assets } from "../assets/assets.js";
import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";

const navLinks = [
  { to: "/", label: "Home", end: true },
  { to: "/doctors", label: "All Doctors" },
  { to: "/about", label: "About" },
  { to: "/contact", label: "Contact" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [token, setToken] = useState(true);
  return (
    <div className="flex items-center justify-between border-b-2 border-gray-200 py-2">
      <img onClick={() => navigate("/")} src={assets.logo} alt="logo" className="h-14 w-36 md:h-20 md:w-45" />
      <ul className="hidden items-start gap-5 font-medium md:flex">
        {navLinks.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className="flex flex-col items-center">
            {({ isActive }) => (
              <>
                <li className={`py-1 ${isActive ? "text-primary" : "hover:text-primary"}`}>{label}</li>
                <hr className={`h-0.5 w-3/5 border-none bg-primary ${isActive ? "block" : "hidden"}`} />
              </>
            )}
          </NavLink>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        {token ?
        <div className="flex gap-2 items-center cursor-pointer group relative">
          <img src={assets.profile_pic} alt="user" className="w-10 h-10 rounded-full" />
          <img src={assets.dropdown_icon} alt="dropdown" className="w-2.5 h-2.5" />
          <div className="absolute top-10 right-0 w-50 bg-white shadow-md rounded-md p-2 z-20 hidden group-hover:block">
            <div className="flex flex-col gap-2 p-2 rounded-md">
              <button onClick={() => navigate("/my-appointments")} className="text-sm font-medium my-1 hover:bg-gray-100 p-2 rounded-md text-left cursor-pointer">My Appointments</button>
              <button onClick={() => navigate("/my-profile")} className="text-sm font-medium my-1 hover:bg-gray-100 p-2 rounded-md text-left cursor-pointer">My Profile</button>
              <button onClick={() => setToken(false)} className="text-sm font-medium my-1 hover:bg-gray-100 p-2 rounded-md text-left cursor-pointer">Logout</button>
            </div>
          </div>
        </div> :
          <button onClick={() => navigate("/create-account")} className="hidden rounded-full bg-primary px-4 py-2 text-white hover:bg-primary/80 md:block">Create Account</button>
        }
        <button type="button" onClick={() => setShowMenu(true)} className="md:hidden" aria-label="Open menu">
          <img src={assets.menu_icon} alt="" className="w-6" />
        </button>
      </div>

      <div className={`${showMenu ? "fixed" : "hidden"} inset-0 z-30 bg-white md:hidden`}>
        <div className="flex items-center justify-between px-5 py-6">
          <img src={assets.logo} alt="logo" className="h-14 w-36" />
          <button type="button" onClick={() => setShowMenu(false)} aria-label="Close menu">
            <img src={assets.cross_icon} alt="" className="w-7" />
          </button>
        </div>
        <ul className="mt-4 flex flex-col gap-2 px-5 text-lg font-medium">
          {navLinks.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} onClick={() => setShowMenu(false)} className="rounded-md px-4 py-3">
              {({ isActive }) => (
                <span className={isActive ? "text-primary" : ""}>{label}</span>
              )}
            </NavLink>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
