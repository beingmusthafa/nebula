import React, { Suspense, lazy, useEffect, useRef, useState } from "react";
import RatingStars from "../../components/RatingStars";
import Accordions from "../../components/Accordions";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ChaptersAccordionSkeletion from "../../components/skeletons/ChaptersAccordionSkeletion";
import CourseDetailsSkeleton from "../../components/skeletons/CourseDetailsSkeleton";
import { useSelector } from "react-redux";
import ReviewCard from "../../components/user/ReviewCard";
import ConfirmationPopup from "../../components/ConfirmationPopup";
import EditReviewForm from "../../components/user/EditReviewForm";
const ChatRoom = lazy(() => import("../../components/user/ChatRoom"));
import Loading from "../../components/Loading";
import ICourse from "../../interfaces/courses.interface";
import IChapter from "../../interfaces/chapters.interface";
import IReview from "../../interfaces/reviews.interface";
import IProgress from "../../interfaces/progress.interface";
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

const LearnCourseEntry = () => {
  const { courseId } = useParams();
  const { currentUser } = useSelector((state: any) => state.user);
  const [course, setCourse] = useState<ICourse | null>(null);
  const [progress, setProgress] = useState<IProgress | null>(null);
  const [reviews, setReviews] = useState<IReview[]>([]);
  const [reviewed, setReviewed] = useState(false);
  const [selectedReview, setSelectedReview] = useState<IReview | null>(null);
  const [showDeleteReview, setShowDeleteReview] = useState(false);
  const [showEditReview, setShowEditReview] = useState(false);
  const [showChatRoom, setShowChatRoom] = useState(false);
  const [chapters, setChapters] = useState<IChapter[] | null>(null);
  const [error, setError] = useState("");
  const [rating, setRating] = useState(1);
  const [loading, setLoading] = useState<boolean>(true);
  let commentRef = useRef<HTMLTextAreaElement>(null);
  const getProgress = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          `/api/get-course-progress/${courseId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      setProgress({
        ...res.progress,
        videos: new Set(res.progress.videos),
        exercises: new Set(res.progress.exercises),
      });
    } catch (error) {
      console.log(error);
    }
  };
  const getReviews = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + `/api/get-reviews/${courseId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      for (const review of res.reviews) {
        if (review.user._id === currentUser._id) {
          setReviewed(true);
          setSelectedReview(review);
          break;
        }
      }
      setReviews(res.reviews);
    } catch (error: any) {
      toast.error(error?.message || error);
      console.log(error);
    }
  };
  async function getCourse() {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          `/api/get-course-details/${courseId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) return console.log(res.message);
      setCourse(res.doc);
      setChapters(res.chapters);
    } catch (error) {
      console.log(error);
    }
  }
  const getData = async () => {
    setLoading(true);
    await Promise.all([getCourse(), getReviews(), getProgress()]);
    setLoading(false);
  };
  useEffect(() => {
    try {
      getData();
    } catch (error) {
      console.log(error);
    }
  }, []);

  let accordionData: { title: string | JSX.Element; content: JSX.Element[] }[] =
    [];
  if (chapters) {
    chapters.forEach((chapter, i) => {
      let content: JSX.Element[] = [];
      let isChapterCompleted: boolean = true;
      chapter.videos.forEach((video, i) => {
        const mins = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        // const duration = `${mins > 9 ? mins : "0" + mins} : ${
        //   seconds > 9 ? seconds : "0" + seconds
        // }`;
        const isVideoCompleted = progress?.videos.has(video._id) || false;
        isChapterCompleted = isChapterCompleted && isVideoCompleted;
        content.push(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            key={i}
            className="flex justify-between w-11/12 py-2 border-t border-slate-500"
          >
            <div className="flex items-center _transition-0-3 hover:text-sky-600 hover:font-bold cursor-pointer">
              <i className="bx bx-video text-xl text-slate-500 mr-2"></i>
              {video.title}
              {isVideoCompleted && (
                <i className="bx bx-check-circle text-xl text-green-500 ml-2"></i>
              )}
            </div>
            <p className="text-slate-500">{`${mins}m ${seconds}s`}</p>
          </motion.div>
        );
      });
      chapter.exercises.forEach((exercise, i) => {
        const isExerciseCompleted =
          progress?.exercises.has(exercise._id) || false;
        isChapterCompleted = isChapterCompleted && isExerciseCompleted;
        content.push(
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            key={i}
            className="flex justify-start w-11/12 py-2 border-t border-slate-500"
          >
            <div className="flex items-center _transition-0-3 hover:text-sky-600 hover:font-bold cursor-pointer">
              <i className="bx bx-notepad text-xl text-slate-500 mr-2"></i>
              {`Exercise - ${i + 1}`}
              {isExerciseCompleted && (
                <i className="bx bx-check-circle text-xl text-green-500 ml-2"></i>
              )}
            </div>
          </motion.div>
        );
      });
      accordionData.push({
        title: (
          <div className="flex w-full justify-between items-center">
            <p className="text-base">
              {chapter.order} : {chapter.title}{" "}
              {isChapterCompleted && (
                <i className="bx bx-check-circle text-xl text-green-500 ml-2"></i>
              )}
            </p>
            <Link
              to={`/my-courses/learn/${courseId}/${chapter._id}`}
              target="_blank"
              rel="noopener noreferrer"
              className="font-bold mr-4 text-sky-500"
            >
              {"Learn>"}
            </Link>
          </div>
        ),
        content,
      });
    });
  }
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
      toast.dismiss(toastId);
      location.reload();
    } catch (error: any) {
      toast.dismiss(toastId);
      toast.error(error);
      console.log(error);
    }
  };
  const handleAddReview = async () => {
    setError("");
    const toastId = toast.loading("Adding review");
    try {
      if (
        commentRef.current?.value.trim() &&
        commentRef.current?.value.length! > 500
      ) {
        toast.dismiss(toastId);
        return setError("Comment must be less than 500 characters");
      }
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/add-review",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            course: courseId,
            rating,
            comment: commentRef.current?.value.trim(),
          }),
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      toast.dismiss(toastId);
      toast.success("Review added successfully");
      location.reload();
    } catch (error: any) {
      toast.dismiss(toastId);
      console.log(error);
      toast.error(error?.message || error);
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
      {showChatRoom && (
        <Suspense fallback={<Loading />}>
          <ChatRoom courseId={courseId!} setShow={setShowChatRoom} />
        </Suspense>
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
              <div className="flex items-center text-base gap-2">
                <i className="bx bx-user-voice text-xl"></i>
                {course.language}
              </div>
              {progress?.videos.size! + progress?.exercises.size! ===
                progress?.target && (
                <div className="flex items-center text-base gap-2 font-bold text-white justify-center bg-green-500 p-2">
                  COMPLETED
                  <i className="bx bx-check-circle text-xl "></i>
                </div>
              )}
            </div>

            <div className="flex flex-col order-1 md:order-2 md:top-40">
              <img
                className="w-80 h-36 object-cover"
                src={course.thumbnail}
                alt=""
              />
              <button
                onClick={() => setShowChatRoom(true)}
                className="_fill-btn-blue w-fit flex items-center mt-8 mx-auto"
              >
                Chat room <i className="bx bx-chat text-lg ml-2"></i>
              </button>
            </div>
          </div>

          <h1 className="_section-title2 text-center">Course contents</h1>
        </>
      ) : (
        <CourseDetailsSkeleton showFull={false} />
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
      {!reviewed && (
        <div className="flex flex-col items-center gap-4 p-4 border-2 w-fit mx-auto _bg-light mt-20">
          <p className="font-semibold text-slate-500 uppercase ">Add review</p>
          {error && <p className="text-red-500 font-semibold my-4">{error}</p>}
          <div className="flex gap-2 ">
            <i
              onClick={() => setRating(1)}
              className="bx bxs-star text-yellow-400 text-3xl"
            ></i>
            <i
              onClick={() => setRating(2)}
              className={`bx text-3xl ${
                rating >= 2 ? "bxs-star text-yellow-400" : "bx-star"
              }`}
            ></i>
            <i
              onClick={() => setRating(3)}
              className={`bx text-3xl ${
                rating >= 3 ? "bxs-star text-yellow-400" : "bx-star"
              }`}
            ></i>
            <i
              onClick={() => setRating(4)}
              className={`bx text-3xl ${
                rating >= 4 ? "bxs-star text-yellow-400" : "bx-star"
              }`}
            ></i>
            <i
              onClick={() => setRating(5)}
              className={`bx text-3xl ${
                rating === 5 ? "bxs-star text-yellow-400" : "bx-star"
              }`}
            ></i>
          </div>
          <textarea
            ref={commentRef}
            name=""
            id=""
            rows={5}
            className="border w-72  border-black p-2"
            placeholder="Write your comment here (optional)"
          ></textarea>
          <button onClick={handleAddReview} className="_fill-btn-blue w-72 ">
            Submit
          </button>
        </div>
      )}
      {reviews.length > 0 && (
        <>
          <h1 className="_section-title2 text-center">Reviews</h1>

          <div className="flex gap-4 whitespace-nowrap overflow-x-auto px-6 _no-scrollbar bg-white my-10">
            {selectedReview && (
              <ReviewCard
                key={selectedReview._id}
                review={selectedReview}
                onDelete={() => {
                  setShowDeleteReview(true);
                }}
                onEdit={() => {
                  setShowEditReview(true);
                }}
              />
            )}
            {reviews.map((review, i) => {
              if (review._id !== selectedReview?._id) {
                return (
                  <ReviewCard
                    key={review._id}
                    review={review}
                    onDelete={() => {
                      setShowDeleteReview(true);
                    }}
                    onEdit={() => {
                      setShowEditReview(true);
                    }}
                  />
                );
              }
            })}
          </div>
        </>
      )}
    </>
  );
};

export default LearnCourseEntry;
