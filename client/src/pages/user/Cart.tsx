import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../../components/Loading";
import RatingStars from "../../components/RatingStars";
import { Link } from "react-router-dom";

interface Course {
  _id: string;
  title: string;
  description: string;
  thumbnail: string;
  price: number;
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
const Cart = () => {
  let [courses, setCourses] = useState<Course[]>([]);
  let [loading, setLoading] = useState<boolean>(true);
  const [couponMessage, setCouponMessage] = useState("");
  console.log(courses);
  async function getCartCourses() {
    setLoading(true);
    const res = await fetch("/api/get-cart-courses").then((res) => res.json());
    if (!res.success) return toast.error(res.message);
    setCourses(res.docs);
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
    } finally {
      setLoading(false);
    }
  }, []);
  const removeFromCart = async (id: string) => {
    try {
      const res = await fetch("/api/remove-from-cart", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          courseId: id,
        }),
      }).then((res) => res.json());
      if (!res.success) return toast.error(res.message);
      getCartCourses();
      toast.success(res.message);
    } catch (error) {
      console.log(error);
    }
  };
  return loading ? (
    <Loading />
  ) : courses.length > 0 ? (
    <div className="flex flex-col md:flex-row">
      <div className="flex justify-evenly md:justify-start flex-wrap gap-8 p-8 _cart-content">
        {courses.map((course, i) => (
          <div className="flex flex-col items-start w-fit">
            <Link to={"/courses/course-details/" + course._id}>
              <img
                src={course.thumbnail}
                className="object-cover w-64 h-36"
                alt=""
              />
              <div
                className="font-bold text-lg text-wrap"
                style={{ width: 270 }}
              >
                {course.title}
              </div>
            </Link>
            {/* <div className="flex gap-2 items-center">
              <img
                src={course.tutor.image}
                alt=""
                className="w-6 h-6 rounded-full"
              />
              <p>{course.tutor.name}</p>
            </div> */}
            <div className="flex items-center">
              <span className="_font-tilt-warp mr-2 text-lg">
                {course.rating}
              </span>
              <RatingStars rating={course.rating} />({course.ratingCount})
            </div>
            <div className="flex justify-between w-64">
              <p className="font-bold text-lg">{course.price}</p>
              <button
                onClick={() => removeFromCart(course._id)}
                className="_fill-btn-blue ml-4"
              >
                <i className="bx bx-trash-alt text-lg"></i>
              </button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-col text-base p-8 _cart-bill">
        <p className="text-xl _font-dm-display mx-auto mb-8 border-b border-black">
          Bill summary
        </p>
        <div className="flex justify-between border-b border-slate-500 p-4">
          Cart total
          <span className="font-semibold">7800</span>
        </div>
        <div className="flex justify-between border-b border-slate-500 p-4">
          Discount
          <span className="font-semibold text-green-600">7800</span>
        </div>
        <div className="flex justify-between border-b border-slate-500 p-4">
          Final total
          <span className="font-bold text-xl">7800</span>
        </div>
        <div className="flex justify-between border text-sm">
          <input type="text" placeholder="COUPON CODE" className="p-2 w-full" />
          <button className="_fill-btn-blue">Apply</button>
        </div>
        {couponMessage && <p className="font-semibold">{couponMessage}</p>}
        <button className="_fill-btn-black uppercase mt-8">Checkout</button>
      </div>
    </div>
  ) : (
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
};

export default Cart;
