import { auth } from "../config/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { useDispatch } from "react-redux";
import { signIn } from "../redux/user/userSlice";
import { useNavigate } from "react-router-dom";

const GoogleAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const handleGoogleAuth = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      const res = await fetch("/api/auth/google-auth", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: result.user.displayName,
          email: result.user.email,
          image: result.user.photoURL,
        }),
      }).then((res) => res.json());
      if (!res.success) return console.log(res.message);
      console.log(res.user);
      dispatch(signIn(res.user));
      navigate("/");
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <button type="button" onClick={handleGoogleAuth} className="_outline-btn ">
      Continue with <i className="bx bxl-google"></i>
    </button>
  );
};

export default GoogleAuth;
