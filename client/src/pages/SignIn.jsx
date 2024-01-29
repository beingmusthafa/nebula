import React from "react";
import welcomeIllustration from "../assets/welcome-illustration.png";
import logo from "../assets/nebula_light.png";
import { motion } from "framer-motion";

const SignIn = () => {
  return (
    <div className="flex _bg-light h-screen w-full items-center">
      <div className="hidden md:flex flex-col items-center w-1/2 pl-10">
        <motion.img
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="w-80"
          src={welcomeIllustration}
          alt=""
        />
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="flex items-center"
        >
          <img src={logo} className="w-24 h-24 mr-4" alt="" />
          <p className="_font-tilt-warp text-5xl">nebula</p>
        </motion.div>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-2xl font-semibold"
        >
          Welcome back!
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg mb-10 text-center"
        >
          Sign in and continue your learning journey. Let learning never stop!
        </motion.p>
      </div>
      <div className="flex flex-col items-center w-full md:w-1/2">
        <div className="flex md:hidden items-center">
          <img src={logo} className="w-16 h-16 mr-4" alt="" />
          <p className="_font-tilt-warp text-5xl">nebula</p>
        </div>
        <form
          className="bg-white w-fit flex flex-col p-8 gap-5"
          action="
        "
        >
          <p className="text-3xl _font-tilt-warp _text-blue-black-gradient mb-6 w-fit mx-auto">
            Sign in
          </p>

          <input
            type="email"
            placeholder="Email"
            className="p-2 text-base border border-black pl-4 w-80"
          />
          <input
            type="text"
            placeholder="Password"
            className="p-2 text-base border border-black pl-4 w-80"
          />
          <button className="_fill-btn uppercase">Sign in</button>
          <button className="_outline-btn ">
            Continue with <i class="bx bxl-google"></i>
          </button>
        </form>
      </div>
    </div>
  );
};

export default SignIn;
