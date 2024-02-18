import { useDispatch } from "react-redux";
import { useState } from "react";
import welcomeIllustration from "../assets/welcome-illustration.png";
import logo from "../assets/nebula_light.png";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { signIn } from "../redux/user/userSlice";
import GoogleAuth from "../components/auth/GoogleAuth";

const SignIn = () => {
  let [error, setError] = useState<string | null>(null);
  let [email, setEmail] = useState<string>("");
  let [password, setPassword] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!(email.trim() && password.trim())) {
      return setError("All fields are required");
    }
    const res = await fetch("/api/auth/sign-in", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then((res) => res.json());
    if (!res.success) {
      return setError(res.message);
    }
    dispatch(signIn(res.user));
    setError(null);
    navigate("/");
  }
  return (
    <div className="flex _bg-light h-fit w-full items-center">
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
        <div className="flex md:hidden items-center mt-20">
          <img src={logo} className="w-14 h-14 mr-4" alt="" />
          <p className="_font-tilt-warp text-4xl">nebula</p>
        </div>
        <form
          onSubmit={handleSubmit}
          className="bg-white w-fit flex flex-col p-8 gap-5"
          action="
        "
        >
          <p className="text-3xl _font-tilt-warp _text-blue-black-gradient mb-6 w-fit mx-auto">
            Sign in
          </p>
          {error && (
            <p className="font-semibold text-base text-red-500">{error}</p>
          )}
          <input
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            className="p-2 text-base border border-black pl-4 w-80"
          />
          <Link
            to={"/forgot-password"}
            className="font-semibold cursor-pointer"
          >
            Forgot password?
          </Link>
          <input
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            placeholder="Password"
            className="p-2 text-base border border-black pl-4 w-80"
          />
          <button className="_fill-btn-blue2 uppercase">Sign in</button>
          <GoogleAuth />
        </form>
      </div>
    </div>
  );
};

export default SignIn;
