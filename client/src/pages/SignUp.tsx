import { useState } from "react";
import teacherIllustration from "../assets/teacher-illustration.png";
import logo from "../assets/nebula_light.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { signIn } from "../redux/user/userSlice";
import GoogleAuth from "../components/auth/GoogleAuth";
import Timer from "../components/Timer";

const SignUp = () => {
  let [error, setError] = useState<string | null>(null);
  let [nameError, setNameError] = useState<string | null>(null);
  let [emailError, setEmailError] = useState<string | null>(null);
  let [passwordError, setPasswordError] = useState<string | null>(null);
  let [confirmPasswordError, setConfirmPasswordError] = useState<string | null>(
    null
  );
  let [verificationStarted, setVerificationStarted] = useState<boolean>(false);
  let [verificationCode, setVerificationCode] = useState<number | null>(null);
  let [email, setEmail] = useState<string>("");
  let [password, setPassword] = useState<string>("");
  let [confirmPassword, setConfirmPassword] = useState<string>("");
  let [name, setName] = useState<string>("");
  let [timerComplete, setTimerComplete] = useState(false);
  let [processing, setProcessing] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function handleSignUp(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setProcessing(true);
    if (!name.trim()) setNameError("Enter name!");
    else setNameError("");
    if (!email.trim()) setEmailError("Enter email!");
    else setEmailError("");
    if (!password.trim()) setPasswordError("Enter password!");
    else setPasswordError("");
    if (!confirmPassword.trim()) setConfirmPasswordError("Confirm password!");
    else setConfirmPasswordError("");
    if (
      !(
        email.trim() &&
        password.trim() &&
        name.trim() &&
        confirmPassword.trim()
      )
    ) {
      return;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordError("Passwords do not match");
      return;
    }
    const res = await fetch(
      import.meta.env.VITE_API_BASE_URL + "/api/auth/start-sign-up",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      }
    ).then((res) => res.json());
    setProcessing(false);
    if (!res.success) {
      setError(res.message);
    } else {
      setError(null);
      setVerificationStarted(true);
    }
  }
  async function handleVerify(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!verificationCode) {
      return setError("Enter verification code");
    }
    try {
      setError("");
      setProcessing(true);
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/auth/finish-sign-up",
        {
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
        }
      ).then((res) => res.json());
      setProcessing(false);
      if (!res.success) return setError(res.message);
      console.log(res.user);
      dispatch(signIn(res.user));
      setError(null);
      setVerificationStarted(false);
      localStorage.setItem("token", res.token);
      navigate("/");
    } catch (error) {
      setError("Something went wrong");
      console.log(error);
    }
  }
  const resendOtp = async () => {
    try {
      setProcessing(true);
      setError("");
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/auth/resend-code",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
          }),
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      setTimerComplete(false);
    } catch (error) {
      setError("Something went wrong");
      console.log(error);
    } finally {
      setProcessing(false);
    }
  };
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
        <div className="flex md:hidden items-center mt-20">
          <img src={logo} className="w-14 h-14 mr-4" alt="" />
          <p className="_font-tilt-warp text-4xl">nebula</p>
        </div>
        {verificationStarted ? (
          <form
            onSubmit={handleVerify}
            className="bg-white w-fit flex flex-col p-8 gap-5"
          >
            <p className="text-3xl _font-tilt-warp _tex t-blue-black-gradient mb-6 w-fit mx-auto">
              Sign up
            </p>
            {timerComplete ? (
              <button
                type="button"
                onClick={resendOtp}
                disabled={processing}
                className="text-base text-sky-600 font-semibold"
              >
                Resend OTP
              </button>
            ) : (
              <Timer
                time={30}
                onComplete={() => {
                  setTimerComplete(true);
                }}
              />
            )}
            {error && (
              <p className="font-semibold text-base text-red-500 w-72">
                {error}
              </p>
            )}
            <p>Enter the verification code sent to your email</p>
            <input
              onChange={(e) => setVerificationCode(Number(e.target.value))}
              type="number"
              placeholder="Verification code"
              className="p-2 text-base border border-black pl-4 w-64 md:w-80"
            />
            <button
              className={`_fill-btn-blue2 uppercase ${
                processing ? "cursor-not-allowed" : ""
              }`}
              disabled={processing}
            >
              Verify
            </button>
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
            {nameError && (
              <p className="font-semibold text-base text-red-500 w-72">
                {nameError}
              </p>
            )}
            <input
              onChange={(e) => setName(e.target.value)}
              type="name"
              placeholder="Full name"
              className="p-2 text-base border border-black pl-4 w-64 md:w-80"
            />
            {emailError && (
              <p className="font-semibold text-base text-red-500 w-72">
                {emailError}
              </p>
            )}
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="p-2 text-base border border-black pl-4 w-64 md:w-80"
            />
            {passwordError && (
              <p className="font-semibold text-base text-red-500 w-72">
                {passwordError}
              </p>
            )}
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="Password"
              className="p-2 text-base border border-black pl-4 w-64 md:w-80"
            />
            {confirmPasswordError && (
              <p className="font-semibold text-base text-red-500 w-72">
                {confirmPasswordError}
              </p>
            )}
            <input
              onChange={(e) => setConfirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm password"
              className="p-2 text-base border border-black pl-4 w-64 md:w-80"
            />
            <button
              className={`_fill-btn-blue2 uppercase ${
                processing ? "cursor-not-allowed" : ""
              }`}
              disabled={processing}
            >
              Sign up
            </button>
            <GoogleAuth />
          </form>
        )}
      </div>
    </div>
  );
};

export default SignUp;
