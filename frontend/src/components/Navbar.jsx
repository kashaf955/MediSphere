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
    <div className="sticky top-0 z-40 -mx-4 flex items-center justify-between border-b border-slate-200/80 bg-white/80 px-4 py-2.5 backdrop-blur-md sm:-mx-[12.5%] sm:px-[12.5%]">
      <img onClick={() => navigate("/")} src={assets.logo} alt="logo" className="h-14 w-36 cursor-pointer md:h-16 md:w-40" />
      <ul className="hidden items-start gap-7 text-sm tracking-wide text-slate-700 md:flex">
        {navLinks.map(({ to, label, end }) => (
          <NavLink key={to} to={to} end={end} className="flex flex-col items-center">
            {({ isActive }) => (
              <>
                <li className={`py-1 transition ${isActive ? "text-primary" : "hover:text-primary"}`}>{label}</li>
                <hr className={`h-0.5 w-3/5 rounded-full border-none bg-primary ${isActive ? "block" : "hidden"}`} />
              </>
            )}
          </NavLink>
        ))}
      </ul>

      <div className="flex items-center gap-3">
        {token ?
        <div className="group relative flex cursor-pointer items-center gap-2">
          <img src={assets.profile_pic} alt="user" className="h-10 w-10 rounded-full object-cover ring-2 ring-white shadow-md" />
          <img src={assets.dropdown_icon} alt="dropdown" className="h-2.5 w-2.5" />
          <div className="absolute right-0 top-12 z-20 hidden w-52 rounded-2xl border border-slate-100 bg-white p-2 shadow-xl shadow-slate-200/80 group-hover:block">
            <div className="flex flex-col">
              <button onClick={() => navigate("/my-appointments")} className="cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-primary">My Appointments</button>
              <button onClick={() => navigate("/my-profile")} className="cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-primary">My Profile</button>
              <button onClick={() => setToken(false)} className="cursor-pointer rounded-xl px-3 py-2.5 text-left text-sm text-slate-700 transition hover:bg-slate-50 hover:text-primary">Logout</button>
            </div>
          </div>
        </div> :
          <button onClick={() => navigate("/login")} className="hidden rounded-full bg-primary px-5 py-2.5 text-sm text-white shadow-lg shadow-primary/30 transition hover:-translate-y-0.5 md:block">Create Account</button>
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
