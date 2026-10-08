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
    <div className="flex justify-between items-center border-b-2 border-gray-200 py-2">
      <img src={assets.logo} alt="logo" className="w-45 h-20" />
      <ul className="flex gap-5 md:flex items-start font-medium">
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

      <div className="flex gap-2">
        {token ?
        <div className="flex gap-2 items-center cursor-pointer group relative">
          <img src={assets.profile_pic} alt="user" className="w-10 h-10 rounded-full" />
          <img src={assets.dropdown_icon} alt="dropdown" className="w-2.5 h-2.5" />
          <div className="absolute top-10 right-0 w-50 bg-white shadow-md rounded-md p-2 z-20 hidden group-hover:block">
            <div className="flex flex-col gap-2 p-2 rounded-md">
              <button onClick={() => navigate("/my-appointments")} className="text-sm font-medium my-1 hover:bg-gray-100 p-2 rounded-md text-left cursor-pointer">My Appointments</button>
              <button onClick={() => navigate("/my-profile")} className="text-sm font-medium my-1 hover:bg-gray-100 p-2 rounded-md text-left cursor-pointer">My Profile</button>
              <button onClick={() => navigate("/logout")} className="text-sm font-medium my-1 hover:bg-gray-100 p-2 rounded-md text-left cursor-pointer">Logout</button>
            </div>
          </div>
        </div> :
          <button onClick={() => navigate("/create-account")} className="bg-primary text-white px-4 py-2 rounded-full hover:bg-primary/80 md:block hidden">Create Account</button>
        }
      </div>
    </div>
  );
};

export default Navbar;
