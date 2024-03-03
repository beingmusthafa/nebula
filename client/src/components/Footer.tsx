import React from "react";
import logo from "../assets/nebula_dark.png";
const Footer = () => {
  return (
    <div className="w-full h-72 bg-slate-800 relative mt-32">
      <div className="flex flex-col absolute bottom-4 left-4 items-center">
        <div className="flex items-center gap-2 ">
          <img src={logo} className="h-20 w-20" alt="" />
          <h2 className="_font-tilt-warp text-4xl text-white">nebula</h2>
        </div>
        <p className="text-slate-200">&copy; Nebula e-learning 2024</p>
      </div>
    </div>
  );
};

export default Footer;
