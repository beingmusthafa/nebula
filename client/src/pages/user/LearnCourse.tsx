import React, { useEffect, useState } from "react";
import RatingStars from "../../components/RatingStars";
import Accordions from "../../components/Accordions";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import TutorDetailsSkeletion from "../../components/skeletons/TutorDetailsSkeletion";
import ChaptersAccordionSkeletion from "../../components/skeletons/ChaptersAccordionSkeletion";
import CourseDetailsSkeleton from "../../components/skeletons/CourseDetailsSkeleton";
import { useSelector } from "react-redux";

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
  exercises: object[];
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
const LearnCourseEntry = () => {
  const { courseId } = useParams();
  const { currentUser } = useSelector((state: any) => state.user);
  let [course, setCourse] = useState<Course | null>(null);
  let [reviews, setReviews] = useState<Review[]>([]);
  let [chapters, setChapters] = useState<Chapter[] | null>(null);
  let [tutor, setTutor] = useState<Tutor | null>(null);
  let [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  console.log(course);
  useEffect(() => {
    try {
      setLoading(true);
      async function getCourse() {
        const res = await fetch(`/api/get-course-details/${courseId}`).then(
          (res) => res.json()
        );
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

  let accordionData: { title: string | JSX.Element; content: JSX.Element[] }[] =
    [];
  if (chapters) {
    chapters.forEach((chapter, i) => {
      let content: JSX.Element[] = [];
      chapter.videos.forEach((video, i) => {
        const mins = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        // const duration = `${mins > 9 ? mins : "0" + mins} : ${
        //   seconds > 9 ? seconds : "0" + seconds
        // }`;
        content.push(
          <div key={i} className="flex justify-between w-11/12 my-1">
            <div className="flex items-center _transition-0-3 hover:text-sky-600 hover:font-bold cursor-pointer">
              <i className="bx bx-video text-xl text-slate-500 mr-2"></i>
              {video.title}
            </div>
            <p>{`${mins}m ${seconds}s`}</p>
          </div>
        );
      });
      chapter.exercises.forEach((exercise, i) => {
        content.push(
          <div key={i} className="flex justify-start w-11/12 my-1">
            <div className="flex items-center _transition-0-3 hover:text-sky-600 hover:font-bold cursor-pointer">
              <i className="bx bx-notepad text-xl text-slate-500 mr-2"></i>
              {`Exercise - ${i + 1}`}
            </div>
          </div>
        );
      });
      accordionData.push({
        title: (
          <div className="flex w-full justify-between items-center">
            <p className="text-base">
              {chapter.order} : {chapter.title}
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

  return (
    <>
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
            </div>
          </div>

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
    </>
  );
};

export default LearnCourseEntry;
