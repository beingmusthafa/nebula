import React, { useEffect, useState } from "react";
import RatingStars from "../../components/RatingStars";
import Accordions from "../../components/Accordions";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import TutorDetailsSkeletion from "../../components/skeletons/TutorDetailsSkeletion";
import ChaptersAccordionSkeletion from "../../components/skeletons/ChaptersAccordionSkeletion";
import CourseDetailsSkeleton from "../../components/skeletons/CourseDetailsSkeleton";
import { useSelector } from "react-redux";
import ConfirmationPopup_Admin from "../../components/ConfirmationPopup_Admin";
import VideoPreview from "../../components/admin/VideoPreview";
import ExercisePreview from "../../components/admin/ExercisePreview";

interface Course {
  title: string;
  description: string;
  thumbnail: string;
  price: number;
  rating: number;
  language: string;
  tutor: {
    name: string;
    image: string;
    bio: string;
  };
  benefits: string[];
  requirements: string[];
  status: string;
  isBlocked: boolean;
}
interface Video {
  video: string;
  title: string;
  duration: number;
  _id: string;
}
interface Exercise {
  question: string;
  options: string[];
  answer: string;
}
interface Chapter {
  _id: string;
  title: string;
  order: number;
  videos: Video[];
  exercises: Exercise[];
}

const PublishedCourseDetails_admin = () => {
  const { courseId } = useParams();
  const { currentUser } = useSelector((state: any) => state.user);
  let [course, setCourse] = useState<Course | null>(null);
  let [showVideoPreview, setShowVideoPreview] = useState(false);
  let [showExercisePreview, setShowExercisePreview] = useState(false);
  let [selectedVideo, setSelectedVideo] = useState<Video | null>(null);
  let [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  let [chapters, setChapters] = useState<Chapter[] | null>(null);
  let [loading, setLoading] = useState<boolean>(true);
  let [showBlockConfirm, setShowBlockConfirm] = useState(false);
  let [showUnblockConfirm, setShowUnblockConfirm] = useState(false);
  const navigate = useNavigate();
  console.log(course);
  useEffect(() => {
    try {
      setLoading(true);
      async function getCourse() {
        const res = await fetch(
          import.meta.env.VITE_API_BASE_URL +
            `/api/get-course-details/${courseId}`,
          {
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("token"),
            },
          }
        ).then((res) => res.json());
        console.log(res);
        if (!res.success) return toast.error(res.message);
        setCourse(res.doc);
        setChapters(res.chapters);
        console.log("chapters", res.chapters);
      }
      getCourse();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

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
            <div
              onClick={() => {
                setSelectedVideo(video);
                setShowVideoPreview(true);
              }}
              className="flex items-center cursor-pointer hover:text-sky-500"
            >
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
            <div
              onClick={() => {
                setSelectedExercise(exercise);
                setShowExercisePreview(true);
              }}
              className="flex items-center hover:text-sky-500 cursor-pointer"
            >
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

  const blockCourse = async () => {
    setShowBlockConfirm(false);
    const toastId = toast.loading("Blocking course");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          "/api/admin/block-course/" +
          courseId,
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          method: "PATCH",
        }
      ).then((res) => res.json());
      toast.dismiss(toastId);
      if (!res.success) throw new Error(res.message);
      location.reload();
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  const unblockCourse = async () => {
    setShowUnblockConfirm(false);
    const toastId = toast.loading("Unblocking course");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          "/api/admin/unblock-course/" +
          courseId,
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          method: "PATCH",
        }
      ).then((res) => res.json());
      toast.dismiss(toastId);
      if (!res.success) throw new Error(res.message);
      location.reload();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <>
      {showVideoPreview && (
        <VideoPreview video={selectedVideo!} setShow={setShowVideoPreview} />
      )}
      {showExercisePreview && (
        <ExercisePreview
          exercise={selectedExercise!}
          setShow={setShowExercisePreview}
        />
      )}
      {showBlockConfirm && (
        <ConfirmationPopup_Admin
          isActionPositive={false}
          confirmText={`Block this course : ${course?.title}?`}
          onCancel={() => setShowBlockConfirm(false)}
          onConfirm={blockCourse}
        />
      )}
      {showUnblockConfirm && (
        <ConfirmationPopup_Admin
          confirmText={`Unblock this course : ${course?.title}?`}
          onCancel={() => setShowUnblockConfirm(false)}
          onConfirm={unblockCourse}
        />
      )}

      {course ? (
        <>
          <div className="bg-gray-800 h-fit w-full flex  md:flex-row flex-col justify-center gap-20 p-10">
            <div className="flex flex-col text-white gap-2 order-2 md:order-1">
              <h1 className="_font-dm-display text-2xl">{course.title}</h1>
              <p className="text-wrap w-80 text-ellipsis overflow-hidden">
                {course.description}
              </p>
              <div className="flex">
                <p className="_font-tilt-warp text-lg mr-4">{course.rating}</p>
                <RatingStars rating={course.rating} starSize={1} />
              </div>
              <p className="font-bold text-bold text-2xl">
                &#8377; {course.price}
              </p>
              <div className="flex items-center text-base gap-2">
                <i className="bx bx-user-voice text-xl"></i>
                {course.language}
              </div>
            </div>

            <div className="flex flex-col order-1 md:order-2 md:sticky md:top-40">
              <img
                className="w-80 h-36 object-cover"
                src={course.thumbnail}
                alt=""
              />
              <div className="flex mx-auto gap-4 mt-4"></div>
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
        <Accordions data={accordionData} />
      ) : (
        <ChaptersAccordionSkeletion />
      )}
      {course && course.tutor ? (
        <div className="flex flex-col border-2 w-4/5 md:w-1/2 mx-auto mt-10 p-6 rounded-2xl border-slate-300">
          <h1 className="font-bold uppercase text-base mb-4 text-slate-500">
            AUTHOR details
          </h1>
          <div className="flex items-start">
            <img
              src={course.tutor?.image}
              className="w-32 h-32 mr-4 rounded-full"
              alt=""
            />
            <div className="flex flex-col">
              <p className="text-lg font-semibold">{course.tutor?.name}</p>
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
      <div className="w-full flex justify-center gap-10 mt-10">
        {course && course?.isBlocked ? (
          <button
            onClick={() => setShowUnblockConfirm(true)}
            className="_fill-btn-green"
          >
            Unblock
          </button>
        ) : course && !course?.isBlocked ? (
          <button
            onClick={() => setShowBlockConfirm(true)}
            className="_fill-btn-red"
          >
            Block
          </button>
        ) : (
          ""
        )}
      </div>
    </>
  );
};

export default PublishedCourseDetails_admin;
