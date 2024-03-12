import { useDispatch } from "react-redux";
import { useState } from "react";
import welcomeIllustration from "../assets/welcome-illustration.png";
import logo from "../assets/nebula_light.png";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { signIn } from "../redux/user/userSlice";

const ForgotPassword = () => {
  const [error, setError] = useState<string | null>(null);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setCofirmPassword] = useState<string>("");
  const [code, setCode] = useState<number | null>(null);
  const [verificationStarted, setVerificationStarted] =
    useState<boolean>(false);
  const [processing, setProcessing] = useState<boolean>(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  async function handleEmailSubmit(e: React.ChangeEvent<HTMLFormElement>) {
    try {
      e.preventDefault();
      setProcessing(true);
      if (!email.trim()) {
        return setError("Enter email!");
      }
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/auth/send-recovery-code",
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
      setProcessing(false);
      if (!res.success) {
        return setError(res.message);
      }
      setError(null);
      setVerificationStarted(true);
    } catch (error) {
      console.log(error);
    }
  }
  async function handleVerifyAndChange(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    try {
      setProcessing(true);
      if (code !== undefined && !password.trim() && !confirmPassword.trim()) {
        return setError("All fields are required!");
      }
      if (password !== confirmPassword) {
        return setError("Passwords do not match!");
      }
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          "/api/auth/verify-and-change-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code,
            password,
          }),
        }
      ).then((res) => res.json());
      setProcessing(false);
      if (!res.success) {
        return setError(res.message);
      }
      setError(null);
      setVerificationStarted(false);
      dispatch(signIn(res.doc));
      localStorage.setItem("token", res.token);
      navigate("/");
    } catch (error) {
      console.log(error);
    }
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
        <div className="flex md:hidden items-center">
          <img src={logo} className="w-16 h-16 mr-4" alt="" />
          <p className="_font-tilt-warp text-5xl">nebula</p>
        </div>

        {verificationStarted ? (
          <form
            onSubmit={handleVerifyAndChange}
            className="bg-white w-fit flex flex-col p-8 gap-5"
            action="
        "
          >
            <p className="text-2xl _font-tilt-warp _text-blue-black-gradient mb-6 w-fit mx-auto">
              Forgot password
            </p>
            <p>A verification code has been sent to your email.</p>
            {error && (
              <p className="font-semibold text-base text-red-500">{error}</p>
            )}
            <input
              onChange={(e) => setCode(Number(e.target.value))}
              type="number"
              placeholder="Verification code"
              className="p-2 text-base border border-black pl-4 w-80"
            />
            <input
              onChange={(e) => setPassword(e.target.value)}
              type="password"
              placeholder="New password"
              className="p-2 text-base border border-black pl-4 w-80"
            />
            <input
              onChange={(e) => setCofirmPassword(e.target.value)}
              type="password"
              placeholder="Confirm new password"
              className="p-2 text-base border border-black pl-4 w-80"
            />
            <button
              className={`_fill-btn-blue2 uppercase ${
                processing ? "cursor-not-allowed" : ""
              }`}
              disabled={processing}
            >
              Change
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleEmailSubmit}
            className="bg-white w-fit flex flex-col p-8 gap-5"
            action="
        "
          >
            <p className="text-2xl _font-tilt-warp _text-blue-black-gradient mb-6 w-fit mx-auto">
              Forgot password
            </p>
            <p>Enter your account email</p>
            {error && (
              <p className="font-semibold text-base text-red-500">{error}</p>
            )}
            <input
              onChange={(e) => setEmail(e.target.value)}
              type="email"
              placeholder="Email"
              className="p-2 text-base border border-black pl-4 w-80"
            />
            <button
              className={`_fill-btn-blue2 uppercase ${
                processing ? "cursor-not-allowed" : ""
              }`}
              disabled={processing}
            >
              Send code
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;
