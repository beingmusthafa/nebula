import React from "react";
import lightLogo from "../assets/nebula_light.png";
import darkLogo from "../assets/nebula_dark.png";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { signIn, signOut } from "../redux/user/userSlice";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  console.log(currentUser);

  return (
    <div className="flex justify-between fixed top-0 left-0 w-full px-4 border-b-4 _border-blue-black-gradient">
      <div className="flex items-center gap-2 cursor-pointer">
        <img
          src={lightLogo}
          alt=""
          height={60}
          width={60}
          className="sm:w-8 sm:h-8 md:w-14 md:h-14"
        />
        <h1 className="_font-tilt-warp text-3xl _color-blue _text-blue-black-gradient cursor-pointer sm:hidden md:block">
          nebula
        </h1>
      </div>
      <div className="flex md:gap-8 xs:gap-8 items-center cursor-pointer">
        {currentUser ? (
          <>
            <i className="bx bx-bookmarks text-3xl cursor-pointer"></i>
            <i className="bx bx-cart-alt text-3xl cursor-pointer"></i>
            <i className="bx bxs-graduation text-3xl cursor-pointer"></i>
            <img
              src="https://htmlcolorcodes.com/assets/images/colors/bright-yellow-color-solid-background-1920x1080.png"
              alt=""
              className="max-h-fit h-10 w-10 rounded-full cursor-pointer"
            />
          </>
        ) : (
          <>
            <button className="_fill-btn">Sign in</button>
            <button className="_outline-btn">Sign up</button>
          </>
        )}
      </div>
    </div>
  );
};

export default Header;
