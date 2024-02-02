import React from "react";
import lightLogo from "../assets/nebula_light.png";
import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { signIn, signOut } from "../redux/user/userSlice";

const Header = () => {
  // const { currentUser } = useSelector((state) => state.user);
  // const dispatch = useDispatch();
  // console.log(currentUser);
  const location = useLocation();
  const currentUser = false;

  return (
    !location.pathname.startsWith("/admin") && (
      <div className="flex justify-between items-center sticky top-0 left-0 w-full px-4 border-b-4 _border-blue-black-gradient2 bg-white z-10">
        <Link to={"/"} className="flex items-center gap-2 cursor-pointer">
          <img
            src={lightLogo}
            alt=""
            height={60}
            width={60}
            className="sm:w-8 sm:h-8 md:w-14 md:h-14"
          />
          <h1 className="_font-tilt-warp text-3xl _color-blue _text-blue-black-gradient cursor-pointer hidden md:block">
            nebula
          </h1>
        </Link>
        <form action="" className="flex justify-center">
          <input
            type="text"
            placeholder="Search for courses or tutors"
            className=" border border-black pl-4 w-80"
          />
          <button className="_fill-btn-blue">
            <i className="bx bx-search-alt-2 text-lg"></i>
          </button>
        </form>
        <div className="flex md:gap-8 gap-4 items-center cursor-pointer">
          {currentUser ? (
            <>
              <Link to={"/admin"}>
                <i className="bx bxs-key text-3xl cursor-pointer"></i>
              </Link>
              <Link to={"/wishlist"}>
                <i className="bx bx-bookmarks text-3xl cursor-pointer"></i>
              </Link>
              <Link to={"/cart"}>
                <i className="bx bx-cart-alt text-3xl cursor-pointer"></i>
              </Link>
              <Link to={"/tutor"}>
                <i className="bx bxs-graduation text-3xl cursor-pointer"></i>
              </Link>
              <img
                src="https://htmlcolorcodes.com/assets/images/colors/bright-yellow-color-solid-background-1920x1080.png"
                alt=""
                className="max-h-fit h-10 w-10 rounded-full cursor-pointer"
              />
            </>
          ) : (
            <>
              <Link to={"/sign-in"} className="_fill-btn-blue">
                Sign in
              </Link>
              <Link to={"/sign-up"} className="_fill-btn-blue">
                Sign up
              </Link>
            </>
          )}
        </div>
      </div>
    )
  );
};

export default Header;
