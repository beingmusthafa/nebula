import { useState } from "react";
import teacherIllustration from "../assets/teacher-illustration.png";
import logo from "../assets/nebula_light.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { signIn } from "../redux/user/userSlice";
const SignUp = () => {
  let [error, setError] = useState(null);
  let [verificationStarted, setVerificationStarted] = useState(false);
  let [verificationCode, setVerificationCode] = useState(null);
  let [email, setEmail] = useState("");
  let [password, setPassword] = useState("");
  let [confirmPassword, setConfirmPassword] = useState("");
  let [name, setName] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function handleSignUp(e) {
    e.preventDefault();
    if (
      !(
        email.trim() &&
        password.trim() &&
        name.trim() &&
        confirmPassword.trim()
      )
    ) {
      return setError("All fields are required");
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    const res = await fetch("/api/auth/start-sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    }).then((res) => res.json());
    if (!res.success) {
      setError(res.message);
    } else {
      setError(null);
      setVerificationStarted(true);
    }
  }
  async function handleVerify(e) {
    e.preventDefault();
    const res = await fetch("/api/auth/finish-sign-up", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userDetails: {
          name,
          email,
          password,
        },
        code: verificationCode,
      }),
    }).then((res) => res.json());
    if (!res.success) return setError(res.message);
    console.log(res.user);
    dispatch(signIn(res.user));
    setError(null);
    setVerificationStarted(false);
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
          src={teacherIllustration}
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
          Where stars are made.
        </motion.p>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="text-lg mb-10 text-center"
        >
          Sign up and start your learning journey with a vast collection of
          expert-made courses. To the stars and beyond!
        </motion.p>
      </div>
      <div className="flex flex-col items-center w-full md:w-1/2">
        <div className="flex md:hidden items-center">
          <img src={logo} className="w-16 h-16 mr-4" alt="" />
          <p className="_font-tilt-warp text-5xl">nebula</p>
        </div>
        {verificationStarted ? (
          <form
            onSubmit={handleVerify}
            className="bg-white w-fit flex flex-col p-8 gap-5"
          >
            <p className="text-3xl _font-tilt-warp _tex t-blue-black-gradient mb-6 w-fit mx-auto">
              Sign up
            </p>
            {error && (
              <p className="font-semibold text-base text-red-500 w-72">
                {error}
              </p>
            )}
            <p>Enter the verification code sent to your email</p>
            <input
              onChange={(e) => setVerificationCode(e.target.value)}
              type="number"
              placeholder="Verification code"
              className="p-2 text-base border border-black pl-4 w-64 md:w-80"
            />
            <button className="_fill-btn uppercase">Verify</button>
          </form>
        ) : (
          <form
            onSubmit={handleSignUp}
            className="bg-white w-fit flex flex-col p-8 gap-5"
          >
            <p className="text-3xl _font-tilt-warp _tex t-blue-black-gradient mb-6 w-fit mx-auto">
              Sign up
            </p>
            {error && (
              <p className="font-semibold text-base text-red-500 w-72">
                {error}
              </p>
            )}
            <input
              onChange={(e) => setName(e.target.value)}
              type="name"
              placeholder="Full name"
              className="p-2 text-base border border-black pl-4 w-64 md:w-80"
            />
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="p-2 text-base border border-black pl-4 w-64 md:w-80"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="text"
              placeholder="Password"
              className="p-2 text-base border border-black pl-4 w-64 md:w-80"
            />
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="text"
              placeholder="Confirm password"
              className="p-2 text-base border border-black pl-4 w-64 md:w-80"
            />
            <button className="_fill-btn uppercase">Sign up</button>
            <button className="_outline-btn ">
              Continue with <i className="bx bxl-google"></i>
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
