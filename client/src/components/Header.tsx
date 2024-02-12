import React, { useEffect, useRef, useState } from "react";
import lightLogo from "../assets/nebula_light.png";
import {
  Link,
  useLoaderData,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { signIn, signOut } from "../redux/user/userSlice";
import { motion } from "framer-motion";

const Header = () => {
  const location = useLocation();
  const { currentUser } = useSelector((state: any) => state.user);
  const searchText = new URLSearchParams(location.search).get("search");
  let [showOptions, setShowOptions] = useState(false);
  let [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  let searchInputRef = useRef<HTMLInputElement | null>(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(currentUser);
  const logout = () => {
    dispatch(signOut());
    setShowOptions(false);
    setShowLogoutConfirm(false);
    navigate("/sign-in");
  };
  const navigateOptions = (route: string) => {
    setShowOptions(false);
    navigate(route);
  };
  const search = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchInputRef.current?.value) return searchInputRef.current?.focus();
    navigate(`/courses?search=${searchInputRef.current?.value}`);
  };
  return (
    !location.pathname.startsWith("/admin") && (
      <div className="flex justify-between items-center h-14 sticky top-0 left-0 w-full px-4 border-b-4 _border-blue-black-gradient2 bg-white z-10">
        <Link to={"/"} className="flex items-center gap-2 cursor-pointer">
          <img
            src={lightLogo}
            alt=""
            height={50}
            width={50}
            className="sm:w-8 sm:h-8 md:w-12 md:h-12"
          />
          <h1 className="_font-tilt-warp text-3xl _color-blue _text-blue-black-gradient cursor-pointer hidden md:block">
            nebula
          </h1>
        </Link>
        <form
          onSubmit={search}
          action=""
          className="flex justify-center border border-black py-1 px-4 rounded-full"
        >
          <input
            ref={searchInputRef}
            defaultValue={searchText || ""}
            type="text"
            placeholder="Search for courses"
            className=" pl-4 w-44 md:w-80 border-0"
          />
          <button className="ml-2">
            <i className="bx bx-search-alt-2 text-lg"></i>
          </button>
        </form>
        <div className="md:gap-8 gap-4 items-center cursor-pointer hidden md:flex">
          {currentUser ? (
            <>
              <button
                className="text-red-500 font-semibold"
                onClick={() => setShowLogoutConfirm(true)}
              >
                Logout
              </button>
              <Link to={"/wishlist"}>
                <i className="bx bx-heart text-2xl cursor-pointer"></i>
              </Link>
              <Link to={"/cart"}>
                <i className="bx bx-cart-alt text-2xl cursor-pointer"></i>
              </Link>
              <Link to={"/tutor"}>
                <i className="bx bxs-graduation text-2xl cursor-pointer"></i>
              </Link>
              <img
                src={currentUser.image}
                className="max-h-fit h-8 w-8 rounded-full cursor-pointer"
              />
            </>
          ) : (
            <>
              <Link to={"/sign-in"} className="_fill-btn-blue2">
                Sign in
              </Link>
              <Link to={"/sign-up"} className="_fill-btn-blue2">
                Sign up
              </Link>
            </>
          )}
        </div>
        <div className="flex md:hidden">
          <i
            onClick={() => setShowOptions(!showOptions)}
            className="bx bx-menu text-3xl text-black"
          ></i>
        </div>
        {currentUser && showOptions && (
          <motion.div
            initial={{ x: 100 }}
            animate={{ x: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute flex md:hidden flex-col top-14 right-0 bg-white px-4"
          >
            <div
              onClick={() => navigateOptions("/wishlist")}
              className="flex items-center gap-2 border-b border-slate-400 p-2"
            >
              <i className="bx bx-heart text-2xl"></i>
              Wishlist
            </div>
            <div
              onClick={() => navigateOptions("/cart")}
              className="flex items-center gap-2 border-b border-slate-400 p-2"
            >
              <i className="bx bx-cart-alt text-2xl"></i>
              Cart
            </div>
            <div
              onClick={() => navigateOptions("/tutor")}
              className="flex items-center gap-2 border-b border-slate-400 p-2"
            >
              <i className="bx bxs-graduation text-2xl "></i>
              Tutor
            </div>
            <div
              onClick={() => navigateOptions("/profile")}
              className="flex items-center gap-2 p-2"
            >
              <img
                src={currentUser.image}
                className="max-h-fit h-8 w-8 rounded-full"
              />
              Profile
            </div>
            <button
              className="text-red-500 font-semibold"
              onClick={() => setShowLogoutConfirm(true)}
            >
              Logout
            </button>
          </motion.div>
        )}
        {!currentUser && showOptions && (
          <div className="absolute flex md:hidden flex-col top-14 right-0 bg-white p-2 gap-2 text-sky-500">
            <button
              onClick={() => navigateOptions("/sign-in")}
              className="uppercase font-bold p-2 border-b border-slate-300"
            >
              sign in
            </button>
            <button
              onClick={() => navigateOptions("/sign-up")}
              className="uppercase font-bold p-2"
            >
              sign up
            </button>
          </div>
        )}
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
      </div>
    )
  );
};

export default Header;
