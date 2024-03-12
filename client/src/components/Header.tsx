import React, { useEffect, useRef, useState, useContext } from "react";
import lightLogo from "../assets/nebula_light.png";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { signIn, signOut } from "../redux/user/userSlice";
import { motion } from "framer-motion";
import ConfirmationPopup from "./ConfirmationPopup";
import { toast } from "react-toastify";
import { CartWishlistContext } from "./context/CartWishlistContext";
import ICourse from "../interfaces/courses.interface";

const Header = () => {
  let { currentUser } = useSelector((state: any) => state.user);
  const searchText = location.pathname.startsWith("/courses")
    ? new URLSearchParams(useLocation().search).get("search")
    : "";
  const { cartCount, wishlistCount, setCartCount, setWishlistCount } =
    useContext(CartWishlistContext)!;
  let [activeRequest, setActiveRequest] = useState<AbortController | null>(
    null
  );
  let [activeTimeout, setActiveTimeout] = useState<NodeJS.Timeout | null>(null);
  let [showOptions, setShowOptions] = useState(false);
  let [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  let searchInputRef = useRef<HTMLInputElement | null>(null);
  let [search, setSearch] = useState<string>("");
  let [result, setResult] = useState<ICourse[]>([]);
  const [showResult, setShowResult] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const logout = async () => {
    const toastId = toast.loading("Logging out");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/auth/sign-out",
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      toast.dismiss(toastId);
      dispatch(signOut());
      setShowOptions(false);
      setShowLogoutConfirm(false);
      localStorage.removeItem("token");
      navigate("/sign-in");
    } catch (error: any) {
      setShowLogoutConfirm(false);
      toast.dismiss(toastId);
      console.log(error.message);
    }
  };
  const navigateOptions = (route: string) => {
    setShowOptions(false);
    navigate(route);
  };
  const handleSearch = (e: React.FormEvent) => {
    setSearch("");
    setResult([]);
    e.preventDefault();
    if (!searchInputRef.current?.value) return searchInputRef.current?.focus();
    navigate(`/courses?search=${searchInputRef.current?.value}`);
  };

  const handleLiveSearch = async (signal: AbortSignal) => {
    console.log("live search ran  " + search);
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/live-search/" + search,
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
            "Content-Type": "application/json",
          },
          signal: signal,
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      setResult(res?.result.docs);
      console.log(res.result.docs);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const abortController = new AbortController();
    handleLiveSearch(abortController.signal);
    if (activeRequest) activeRequest.abort();
    setActiveRequest(abortController);
    return () => activeRequest?.abort();
  }, [search]);

  const getCartAndWishlistCount = async () => {
    try {
      if (!currentUser) return;
      const fetch1 = fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/get-cart-count",
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      const fetch2 = fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/get-wishlist-count",
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      const [res1, res2] = await Promise.all([fetch1, fetch2]);
      if (!res1.success || !res2.success) {
        throw new Error(res1.success ? res2.message : res1.message);
      }
      setCartCount(res1.count);
      setWishlistCount(res2.count);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCartAndWishlistCount();
  }, []);

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
          onSubmit={handleSearch}
          action=""
          className="flex justify-center border border-black py-1 px-4 rounded-full relative"
        >
          {showResult && result?.length > 0 && (
            <div className="absolute w-[90vw] md:w-[40vw] flex flex-col top-12 gap-4 _bg-light p-4">
              {result.map((course) => (
                <div
                  key={course._id}
                  onClick={() => {
                    console.log("clicked");
                    setResult([]);
                    setSearch("");
                    location.href = "/course-details/" + course._id;
                  }}
                  className="flex gap-4 items-center justify-center cursor-pointer border border-black bg-white"
                >
                  <img src={course.thumbnail} className="h-16" alt="" />
                  <p className="font-medium w-full overflow-hidden whitespace-nowrap  text-ellipsis ">
                    {course.title}
                  </p>
                </div>
              ))}
            </div>
          )}
          <input
            ref={searchInputRef}
            defaultValue={searchText || ""}
            type="text"
            onFocus={() => setShowResult(true)}
            onBlur={() => {
              setTimeout(() => {
                setShowResult(false);
              }, 100);
            }}
            onChange={(e) => {
              if (!e.target.value) {
                setResult([]);
                return;
              }
              const timeout = setTimeout(() => {
                setSearch(e.target.value);
              }, 300);
              if (activeTimeout) clearTimeout(activeTimeout);
              setActiveTimeout(timeout);
            }}
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
              <Link to={"/my-courses"}>
                <i className="bx hover:bg-slate-200 _transition-0-5 rounded-full py-1 px-2 bxs-videos text-2xl cursor-pointer"></i>
              </Link>
              <Link to={"/wishlist"}>
                <i className="bx hover:bg-slate-200 _transition-0-5 rounded-full py-1 px-2 bx-heart text-2xl cursor-pointer relative">
                  {wishlistCount! > 0 && (
                    <span className="absolute font-sans top-0 -right-1 px-2 bg-sky-500 rounded-full text-white font-bold text-sm">
                      {wishlistCount}
                    </span>
                  )}
                </i>
              </Link>
              <Link to={"/cart"}>
                <i className="bx hover:bg-slate-200 _transition-0-5 rounded-full py-1 px-2 bx-cart-alt text-2xl cursor-pointer relative">
                  {cartCount! > 0 && (
                    <span className="absolute font-sans top-0 -right-1 px-2 bg-sky-500 rounded-full text-white font-bold text-sm">
                      {cartCount!}
                    </span>
                  )}
                </i>
              </Link>
              <Link to={"/tutor"}>
                <i className="bx hover:bg-slate-200 _transition-0-5 rounded-full py-1 px-2 bxs-graduation text-2xl cursor-pointer"></i>
              </Link>
              <Link to={"/profile"}>
                <img
                  src={currentUser.image}
                  className="max-h-fit h-8 w-8 rounded-full cursor-pointer"
                />
              </Link>
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
              onClick={() => navigateOptions("/my-courses")}
              className="flex items-center gap-2 border-b border-slate-400 p-2"
            >
              <i className="bx bxs-videos text-2xl"></i>
              My courses
            </div>
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
              className="text-red-500 font-semibold my-4"
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
          <ConfirmationPopup
            confirmText="Are you sure you want to logout?"
            onCancel={() => setShowLogoutConfirm(false)}
            onConfirm={logout}
          />
        )}
      </div>
    )
  );
};

export default Header;
