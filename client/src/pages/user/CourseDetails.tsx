import React, { useEffect, useState } from "react";
import RatingStars from "../../components/RatingStars";
import Accordions from "../../components/Accordions";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import TutorDetailsSkeletion from "../../components/skeletons/TutorDetailsSkeletion";
import ChaptersAccordionSkeletion from "../../components/skeletons/ChaptersAccordionSkeletion";
import CourseDetailsSkeleton from "../../components/skeletons/CourseDetailsSkeleton";
import { useDispatch, useSelector } from "react-redux";
import ReviewCard from "../../components/user/ReviewCard";
import EditReviewForm from "../../components/user/EditReviewForm";
import ConfirmationPopup from "../../components/ConfirmationPopup";
import { setCartCount, setWishlistCount } from "../../redux/user/userSlice";

interface Course {
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  discount: number;
  rating: number;
  language: string;
  tutor: {
    name: string;
    image: string;
    bio: string;
  };
  benefits: string[];
  requirements: string[];
}
interface Tutor {
  image: string;
  name: string;
  bio: string;
  courseCount: number;
  studentCount: number;
  rating: number;
  inWishlist?: boolean;
  inCart?: boolean;
}
interface Chapter {
  _id: string;
  title: string;
  order: number;
  videos: { title: string; duration: number }[];
  exercises: { title: string; duration: string }[];
}
interface Review {
  _id: string;
  user: {
    _id: string;
    name: string;
    image: string;
  };
  rating: number;
  comment: string;
}
const CourseDetails = () => {
  const { id } = useParams();
  const { currentUser, cartCount, wishlistCount } = useSelector(
    (state: any) => state.user
  );
  let [course, setCourse] = useState<Course | null>(null);
  let [reviews, setReviews] = useState<Review[]>([]);
  let [selectedReview, setSelectedReview] = useState<Review | null>(null);
  let [showDeleteReview, setShowDeleteReview] = useState(false);
  let [showEditReview, setShowEditReview] = useState(false);
  let [data, setData] = useState<{
    inCart: Boolean | undefined;
    inWishlist: boolean | undefined;
  }>();
  let [chapters, setChapters] = useState<Chapter[] | null>(null);
  let [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      setLoading(true);
      async function getCourse() {
        const res = await fetch(
          import.meta.env.VITE_API_BASE_URL + `/api/get-course-details/${id}`,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": "Bearer " + localStorage.getItem("token"),
            },
          }
        ).then((res) => res.json());
        if (!res.success) return toast.error(res.message);
        setCourse(res.doc);
        setChapters(res.chapters);
        if (currentUser) {
          const res = await fetch(
            import.meta.env.VITE_API_BASE_URL +
              `/api/check-cart-and-wishlist/${id}`,
            {
              headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("token"),
              },
            }
          ).then((res) => res.json());
          if (!res.success) return console.log(res.message);
          setData(res.data);
        }
      }
      getCourse();
      getReviews();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getReviews = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + `/api/get-reviews/${id}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      setReviews(res.reviews);
    } catch (error: any) {
      console.log(error);
    }
  };

  let accordionData: { title: string; content: JSX.Element[] }[] = [];
  if (chapters) {
    chapters.forEach((chapter, i) => {
      let content: JSX.Element[] = [];
      chapter.videos.forEach((video, i) => {
        const mins = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        content.push(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            key={i}
            className="flex justify-between w-11/12 py-2 border-t border-slate-500"
          >
            <div className="flex items-center">
              <i className="bx bx-video text-xl text-slate-500 mr-2"></i>
              {video.title}
            </div>
            <p>{`${mins}m ${seconds}s`}</p>
          </motion.div>
        );
      });
      chapter.exercises.forEach((exercise, i) => {
        content.push(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            key={i}
            className="flex justify-between w-11/12 py-2 border-t border-slate-500"
          >
            <div className="flex items-center">
              <i className="bx bx-notepad text-xl text-slate-500 mr-2"></i>
              {`Exercise - ${i + 1}`}
            </div>
          </motion.div>
        );
      });
      accordionData.push({
        title: `Chapter ${chapter.order} - ${chapter.title}`,
        content,
      });
    });
  }
  const addtoCart = async () => {
    if (!currentUser) return navigate("/sign-in");
    const toastId = toast.loading("Adding to cart");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/add-to-cart",
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
      toast.dismiss(toastId);
      if (!res.success) throw new Error(res.message);
      setCartCount(cartCount + 1);
      const newData = { inCart: true, inWishlist: data?.inWishlist };
      setData(newData);
    } catch (error) {
      toast.dismiss(toastId);
      console.log(error);
    }
  };
  const removeFromCart = async () => {
    if (!currentUser) return navigate("/sign-in");
    const toastId = toast.loading("Removing from cart");
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
      toast.dismiss(toastId);
      if (!res.success) throw new Error(res.message);
      setCartCount(cartCount - 1);
      const newData = { inCart: false, inWishlist: data?.inWishlist };
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };
  const addtoWishlist = async () => {
    if (!currentUser) return navigate("/sign-in");
    const toastId = toast.loading("Adding to wishlist");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/add-to-wishlist",
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
      toast.dismiss(toastId);
      if (!res.success) throw new Error(res.message);
      setWishlistCount(wishlistCount + 1);
      const newData = { inCart: data?.inCart, inWishlist: true };
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };
  const removeFromWishlist = async () => {
    if (!currentUser) return navigate("/sign-in");
    const toastId = toast.loading("Removing from wishlist");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/remove-from-wishlist",
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
      toast.dismiss(toastId);
      if (!res.success) return toast.error(res.message);
      setWishlistCount(wishlistCount - 1);
      const newData = { inCart: data?.inCart, inWishlist: false };
      setData(newData);
    } catch (error) {
      console.log(error);
    }
  };
  const handleDeleteReview = async () => {
    const toastId = toast.loading("Deleting review");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          `/api/delete-review/${selectedReview?._id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      toast.success(res.message);
      setSelectedReview(null);
      setShowDeleteReview(false);
      getReviews();
    } catch (error: any) {
      toast.dismiss(toastId);
      console.log(error);
    }
  };

  return (
    <>
      {showEditReview && (
        <EditReviewForm
          review={selectedReview!}
          setShow={setShowEditReview}
          getReviews={getReviews}
        />
      )}
      {showDeleteReview && (
        <ConfirmationPopup
          isActionPositive={false}
          confirmText="Do you want to delete this review?"
          onCancel={() => setShowDeleteReview(false)}
          onConfirm={handleDeleteReview}
        />
      )}
      {course ? (
        <>
          <div className="bg-gray-800 h-fit w-full flex  md:flex-row flex-col items-center justify-center gap-20 p-10">
            <div className="flex flex-col text-white gap-2 order-2 md:order-1">
              <h1 className="_font-dm-display text-2xl">{course.title}</h1>
              <p className="text-wrap w-80 text-ellipsis overflow-hidden">
                {course.description}
              </p>
              <div className="flex">
                <p className="_font-tilt-warp text-lg mr-4">{course.rating}</p>
                <RatingStars rating={course.rating} starSize={1} />
              </div>
              <div className="flex items-baseline gap-2">
                {course.discount > 0 ? (
                  <>
                    <p className="font-semibold text-bold text-xl line-through text-slate-300">
                      &#8377; {course.price}
                    </p>
                    <p className="font-bold text-bold text-2xl text-green-400">
                      &#8377; {course.price - course.discount}
                    </p>
                  </>
                ) : (
                  <p className="font-bold text-bold text-2xl ">
                    &#8377; {course.price}
                  </p>
                )}
              </div>
              <div className="flex items-center text-base gap-2">
                <i className="bx bx-user-voice text-xl"></i>
                {course.language}
              </div>
            </div>

            <div className="flex flex-col items-center order-1 md:order-2 md:top-40">
              <img
                className="w-80 h-36 object-cover"
                src={course.thumbnail}
                alt=""
              />
              <div className="flex mx-auto gap-4 mt-4">
                {currentUser && data?.inCart ? (
                  <div
                    onClick={removeFromCart}
                    className="_fill-btn-blue flex items-center gap-2"
                  >
                    Remove from cart <i className="bx bx-trash text-xl"></i>
                  </div>
                ) : (
                  <div
                    onClick={addtoCart}
                    className="_fill-btn-blue flex items-center gap-2"
                  >
                    Add to cart <i className="bx bx-cart-add text-xl"></i>
                  </div>
                )}
                {currentUser && data?.inWishlist ? (
                  <button
                    className="_fill-btn-blue"
                    onClick={removeFromWishlist}
                  >
                    <i className="bx bxs-heart text-xl"></i>
                  </button>
                ) : (
                  <button className="_fill-btn-blue" onClick={addtoWishlist}>
                    <i className="bx bx-heart text-xl"></i>
                  </button>
                )}
              </div>
            </div>
          </div>
          {course.benefits.length > 0 && (
            <>
              <h2 className="_section-title2">Course benefits</h2>
              <div className="flex flex-col items-start mx-auto px-10 gap-2">
                {course.benefits.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-base text-wrap overflow-hidden text-ellipsis"
                    style={{ maxWidth: "90%" }}
                  >
                    <i className="bx bx-check text-2xl text-green-600"></i>
                    {benefit}
                  </div>
                ))}
              </div>
            </>
          )}
          {course.requirements.length > 0 && (
            <>
              <h2 className="_section-title2">Pre-requisites</h2>
              <div className="flex flex-col items-start mx-auto px-10 gap-2">
                {course.requirements.map((requirement, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-base text-wrap overflow-hidden text-ellipsis"
                    style={{ maxWidth: "90%" }}
                  >
                    <i className="bx bx-info-circle text-2xl"></i>
                    {requirement}
                  </div>
                ))}
              </div>
            </>
          )}
          <h1 className="_section-title2 text-center">Course contents</h1>
        </>
      ) : (
        <CourseDetailsSkeleton />
      )}
      {chapters ? (
        chapters.length > 0 ? (
          <Accordions data={accordionData} />
        ) : (
          <p className="_font-dm-display my-32 text-xl text-center text-slate-500">
            No content added
          </p>
        )
      ) : (
        <ChaptersAccordionSkeletion />
      )}
      {course && course.tutor ? (
        <div className="flex flex-col border-2 w-4/5 md:w-1/2 mx-auto mt-10 p-6 rounded-2xl border-slate-300">
          <h1 className="font-bold text-center md:text-start uppercase text-base mb-4 text-slate-500">
            TUTOR details
          </h1>
          <div className="flex flex-col md:flex-row items-center gap-6 md:gap-0 md:items-start">
            <img
              src={course.tutor?.image}
              className="w-32 h-32 mr-4 rounded-full"
              alt=""
            />
            <div className="flex flex-col">
              <p className="text-lg text-center md:text-start  font-semibold">
                {course.tutor?.name}
              </p>
              <p className="text-sm mb-4 text-slate-600">
                {course.tutor.bio || "No bio provided"}
              </p>
              {/* <div className="flex items-center gap-2 font-semibold">
                <i className="bx bx-movie-play text-xl"></i>
                {tutor.courseCount} courses
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <i className="bx bxs-graduation text-xl"></i>
                {tutor.studentCount} students
              </div>
              <div className="flex items-center gap-2 font-semibold">
                <i className="bx bx-star text-xl"></i>
                {tutor.rating}/5 average rating
              </div> */}
            </div>
          </div>
        </div>
      ) : (
        <TutorDetailsSkeletion />
      )}
      {reviews.length > 0 && (
        <>
          <h1 className="_section-title2 text-center">Reviews</h1>
          <div className="flex gap-4 whitespace-nowrap overflow-x-auto px-6 _no-scrollbar bg-white my-10">
            {reviews.map((review, i) => (
              <ReviewCard
                key={review._id}
                review={review}
                onDelete={() => {
                  setSelectedReview(review);
                  setShowDeleteReview(true);
                }}
                onEdit={() => {
                  setSelectedReview(review);
                  setShowEditReview(true);
                }}
              />
            ))}
          </div>
        </>
      )}
    </>
  );
};

export default CourseDetails;
