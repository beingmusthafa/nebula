import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import logo from "../../assets/nebula_dark.png";
import { signOut } from "../../redux/user/userSlice";
import { animate, motion } from "framer-motion";

const Sidebar = () => {
  const location = useLocation();
  const path = location.pathname.split("/")[2];
  let [active, setActive] = useState(path);
  let [showOptions, setShowOptions] = useState(false);
  let [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = () => {
    dispatch(signOut());
    setShowOptions(false);
    setShowLogoutConfirm(false);
    navigate("/sign-in");
  };
  const navigateOptions = (route: string) => {
    setShowOptions(false);
    setActive(route);
    navigate("/admin/" + route);
  };
  return (
    location.pathname.startsWith("/admin") && (
      <>
        <div className="w-64 col-span-1 bg-black fixed top-0 left-0 bottom-0 py-4 _admin-sidebar">
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
            <button
              onClick={() => setShowLogoutConfirm(true)}
              className="_fill-btn-red bg-red-500"
            >
              Logout
            </button>
          </div>
        </div>
        {/* header */}
        <div className="sticky top-0 w-full border-b-2 _border-blue-black-gradient2 bg-white flex md:hidden items-center justify-between p-2 px-4">
          <p className="font-bold  uppercase">{active}</p>
          {(active === "users" || active === "courses") && (
            <form
              action=""
              className="flex w-fit justify-center border border-black py-1 px-4 rounded-full"
            >
              <input
                type="text"
                placeholder={`Search for ${active}`}
                className=" pl-4 w-min md:w-80 border-0"
              />
              <button className="ml-2">
                <i className="bx bx-search-alt-2 text-lg"></i>
              </button>
            </form>
          )}
          <i
            onClick={() => setShowOptions(!showOptions)}
            className="bx bx-menu text-3xl text-black"
          ></i>
          {showOptions && (
            <motion.div
              initial={{ x: 100 }}
              animate={{ x: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute flex md:hidden flex-col top-14 right-0 bg-white px-4"
            >
              <div
                onClick={() => navigateOptions("stats")}
                className="flex items-center gap-2 border-b border-slate-400 p-2"
              >
                Stats
              </div>
              <div
                onClick={() => navigateOptions("users")}
                className="flex items-center gap-2 border-b border-slate-400 p-2"
              >
                Users
              </div>
              <div
                onClick={() => navigateOptions("courses")}
                className="flex items-center gap-2 border-b border-slate-400 p-2"
              >
                Courses
              </div>
              <div
                onClick={() => navigateOptions("offers")}
                className="flex items-center gap-2 border-b border-slate-400 p-2"
              >
                Offers
              </div>
              <div
                onClick={() => navigateOptions("banners")}
                className="flex items-center gap-2 border-b border-slate-400 p-2"
              >
                Banners
              </div>
              <button
                className="text-red-500 font-semibold"
                onClick={() => setShowLogoutConfirm(true)}
              >
                Logout
              </button>
            </motion.div>
          )}
        </div>
        {showLogoutConfirm && (
          <div className="flex fixed w-full justify-center">
            <div className="flex flex-col p-6 fixed top-1/3 border-2 border-black bg-white">
              <div className="text-base font-medium">
                Are you sure you want to logout?
              </div>
              <div className="flex gap-10 mx-auto mt-4">
                <button
                  onClick={() => setShowLogoutConfirm(false)}
                  className="_fill-btn-black"
                >
                  Cancel
                </button>
                <button onClick={logout} className="_fill-btn-red">
                  Yes
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    )
  );
};

export default Sidebar;
