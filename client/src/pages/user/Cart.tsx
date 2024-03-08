import React, { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import CourseSkeleton from "../../components/skeletons/CourseSkeleton";
import CourseCard from "../../components/CourseCard";
import ConfirmationPopup from "../../components/ConfirmationPopup";
import { loadStripe } from "@stripe/stripe-js";
import { useDispatch, useSelector } from "react-redux";
import { CartWishlistContext } from "../../components/context/CartWishlistContext";
interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  discount: number;
  rating: number;
  ratingCount: number;
  language: string;
  tutor: {
    name: string;
    image: string;
    bio: string;
  };
  benefits: string[];
  requirements: string[];
}
interface Bill {
  totalPrice: number;
  totalDiscount: number;
  finalTotal: number;
}
const Cart = () => {
  const { cartCount, setCartCount } = useContext(CartWishlistContext)!;
  let [loading, setLoading] = useState<boolean>(true);
  let [courses, setCourses] = useState<Course[]>([]);
  let [bill, setBill] = useState<Bill | null>(null);
  let [selected, setSelected] = useState<Course | null>(null);
  let [showConfirm, setShowConfirm] = useState(false);
  let skeletons = new Array(7).fill(0);
  const [couponMessage, setCouponMessage] = useState("");
  async function getCartCourses() {
    setLoading(true);
    const res = await fetch(
      import.meta.env.VITE_API_BASE_URL + "/api/get-cart-courses",
      {
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      }
    ).then((res) => res.json());
    if (!res.success) return toast.error(res.message);
    setCourses(res.docs);
    setBill(res.bill);
    setLoading(false);
  }
  useEffect(() => {
    try {
      getCartCourses();
      return () => {
        setCourses([]);
      };
    } catch {
      toast.error("Something went wrong");
    }
  }, []);
  const removeFromCart = async (id: string) => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/remove-from-cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            courseId: id,
          }),
        }
      ).then((res) => res.json());
      if (!res.success) return toast.error(res.message);
      setCartCount((prev) => prev - 1);
      getCartCourses();
      toast.success(res.message);
    } catch (error) {
      console.log(error);
    }
  };
  const goToPayment = async () => {
    try {
      const stripe = await loadStripe(import.meta.env.VITE_STRIPE_CLIENT_KEY!);
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/create-checkout-session",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) return toast.error(res.message);
      const { sessionId } = res;
      const result = await stripe?.redirectToCheckout({ sessionId });
      if (result?.error) console.log(result.error.message);
    } catch (error) {
      console.log(error);
    }
  };
  if (loading) {
    return (
      <div className="flex md:flex-row flex-wrap justify-center md:justify-start h-full w-full md:w-4/5 gap-4 p-8">
        {skeletons.map((_, index) => (
          <CourseSkeleton key={index} />
        ))}
      </div>
    );
  }
  if (courses.length > 0) {
    return (
      <>
        <div className="flex flex-col md:flex-row">
          <div className="flex justify-evenly md:justify-start h-fit flex-wrap gap-8 p-8 _cart-content">
            {courses.map((course, i) => (
              <CourseCard
                key={course._id}
                course={course}
                showTutor={false}
                extraElements={
                  <button
                    onClick={() => {
                      setSelected(course);
                      setShowConfirm(true);
                    }}
                    className="_fill-btn-blue ml-4"
                  >
                    <i className="bx bx-trash-alt text-base"></i>
                  </button>
                }
              />
            ))}
          </div>
          <div className="flex flex-col text-base p-8 _cart-bill">
            <p className="text-xl _font-dm-display mx-auto mb-8 border-b border-black">
              Bill summary
            </p>
            <div className="flex justify-between border-b border-slate-500 p-4">
              Total price
              <span className=" text-slate-500">
                &#8377; {bill?.totalPrice}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-500 p-4">
              Discount
              <span className=" text-green-600">
                - &#8377; {bill?.totalDiscount}
              </span>
            </div>
            <div className="flex justify-between border-b border-slate-500 p-4">
              Final total
              <span className="font-bold text-xl">
                &#8377; {bill?.finalTotal}
              </span>
            </div>
            {/* <div className="flex justify-between border text-sm">
              <input
                type="text"
                placeholder="COUPON CODE"
                className="p-2 w-full"
              />
              <button className="_fill-btn-blue">Apply</button>
            </div> */}
            {couponMessage && <p className="font-semibold">{couponMessage}</p>}
            <button
              onClick={goToPayment}
              className="_fill-btn-black uppercase mt-8"
            >
              Checkout
            </button>
          </div>
        </div>

        {showConfirm && (
          <ConfirmationPopup
            confirmText={`Remove this course from cart? :\n "${selected?.title}"`}
            onCancel={() => setShowConfirm(false)}
            onConfirm={() => removeFromCart(selected?._id!)}
          />
        )}
      </>
    );
  } else {
    return (
      <div className="flex w-full mt-52 items-center justify-center">
        <div className="flex flex-col">
          <img src="" alt="" />
          <p className="font-semibold text-lg">
            No courses in cart. <br className="block md:hidden" />
            <Link to={"/courses"} className="text-sky-600">
              Explore courses
            </Link>
          </p>
        </div>
      </div>
    );
  }
};

export default Cart;
