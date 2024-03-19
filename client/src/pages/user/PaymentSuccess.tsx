import React, { useContext } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CartWishlistContext } from "../../components/context/CartWishlistContext";
const PaymentSuccess = () => {
  const navigate = useNavigate();
  const { currentUser } = useSelector((state: any) => state.user);
  const getCartAndWishlistCount = async () => {
    try {
      if (!currentUser) return;
      const { setCartCount, setWishlistCount } =
        useContext(CartWishlistContext);
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
  getCartAndWishlistCount();
  setTimeout(() => {
    navigate("/my-courses");
  }, 3000);
  return (
    <div className="fixed h-full w-full flex flex-col  items-center pt-64 md:pt-32">
      <motion.i
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bx bxs-party text-sky-500 text-5xl mb-10"
        style={{ fontSize: "5rem" }}
      ></motion.i>
      <motion.h1
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="_font-dm-display text-3xl"
      >
        Payment successful
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-4 text-base w-72 md:w-96 text-center"
      >
        Thank you for your purchase. Redirecting to home page...
      </motion.p>
    </div>
  );
};

export default PaymentSuccess;
