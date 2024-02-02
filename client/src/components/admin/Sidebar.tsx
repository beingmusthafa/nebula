import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import logo from "../../assets/nebula_dark.png";
const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  let [active, setActive] = useState(path);
  console.log("run");

  return (
    location.pathname.startsWith("/admin") && (
      <div className="w-64 bg-black fixed top-0 left-0 bottom-0 h-full flex flex-col items-center justify-between py-4">
        <div className="flex items-center">
          <img src={logo} className="w-14 h-14 mr-4" alt="" />
          <p className="_font-tilt-warp text-3xl text-white">nebula</p>
        </div>
        <div className="flex flex-col items-start gap-6 text-base font-semibold text-slate-200">
          <Link
            to="/admin/stats"
            className={active === "stats" ? "bg-white text-black px-4" : ""}
            onClick={() => setActive("stats")}
          >
            Stats
          </Link>
          <Link
            to="/admin/users"
            className={active === "users" ? "bg-white text-black px-4" : ""}
            onClick={() => setActive("users")}
          >
            Users
          </Link>
          <Link
            to="/admin/courses"
            className={active === "courses" ? "bg-white text-black px-4" : ""}
            onClick={() => setActive("courses")}
          >
            Courses
          </Link>
          <Link
            to="/admin/offers"
            className={active === "offers" ? "bg-white text-black px-4" : ""}
            onClick={() => setActive("offers")}
          >
            Offers
          </Link>
          <Link
            to="/admin/banners"
            className={active === "banners" ? "bg-white text-black px-4" : ""}
            onClick={() => setActive("banners")}
          >
            Banners
          </Link>
        </div>
        <div className="flex gap-6">
          <Link to="/" className="_fill-btn-blue">
            Home
          </Link>
          <button className="_fill-btn-red bg-red-500">Logout</button>
        </div>
      </div>
    )
  );
};

export default Sidebar;
