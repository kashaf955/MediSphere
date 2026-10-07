import React from "react";
import { assets } from "../assets/assets.js";
import { NavLink } from "react-router-dom";

const Navbar = () => {
  return (
    <div className="flex justify-between items-center border-b-2 border-gray-200 py-2">
      <img src={assets.logo} alt="logo" className="w-45 h-20" />
      <ul className="flex gap-5 md:flex items-start font-medium">
        <NavLink to="/">
          <li className="hover:text-primary py-1">Home</li>
          <hr className="border-b-2 border-gray-200 bg-primary" />
        </NavLink>
        <NavLink to="/doctors">
          <li className="hover:text-primary py-1">All Doctors</li>
          <hr className="border-b-2 border-gray-200 bg-primary" />
        </NavLink>
        <NavLink to="/about">
          <li className="hover:text-primary py-1">About</li>
          <hr className="border-b-2 border-gray-200 bg-primary" />
        </NavLink>
        <NavLink to="/contact">
          <li className="hover:text-primary py-1">Contact</li>
          <hr className="border-b-2 border-gray-200 bg-primary" />
        </NavLink>
      </ul>
    </div>
  );
};

export default Navbar;
