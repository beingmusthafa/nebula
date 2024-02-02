import React, { useEffect, useState } from "react";
import CourseCard from "../components/CourseCard";
import CourseSkeleton from "../components/CourseSkeleton";
const Home = () => {
  let [images, setImages] = useState([]);
  let [courses, setCourses] = useState([]);
  let [currentIndex, setCurrentIndex] = useState(0);
  let skeletons = new Array(7).fill(0);
  // useEffect(() => {
  //   async function getSlides() {
  //     const res = await fetch("/api/get-home-slides").then((res) => res.json());
  //     setImages(res.images);
  //   }
  //   getSlides();
  // }, []);
  // useEffect(() => {
  //   const timer = setTimeout(() => {
  //     const nextIndex = (currentIndex + 1) % images.length;
  //     setCurrentIndex(nextIndex);
  //   }, 4000);
  //   return () => {
  //     clearTimeout(timer);
  //   };
  // }, [currentIndex, images.length]);
  // useEffect(() => {
  //   async function getCourses() {
  //     const res = await fetch("/api/get-home-courses").then((res) =>
  //       res.json()
  //     );
  //     setCourses(res.courses);
  //   }
  //   setTimeout(() => {
  //     getCourses();
  //   }, 2000);
  // }, []);
  return (
    <>
      <img
        className="w-full max-h-52 md:max-h-80 object-cover"
        src={
          images[currentIndex] ||
          "https://htmlcolorcodes.com/assets/images/colors/bright-yellow-color-solid-background-1920x1080.png"
        }
        alt=""
      />
      <div className="_section-title">Top courses</div>
      <div className="flex gap-4 whitespace-nowrap overflow-x-auto px-6 _no-scrollbar">
        {courses.length > 0
          ? courses?.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))
          : skeletons.map((_, index) => <CourseSkeleton key={index} />)}
      </div>
      <div className="_section-title">Dev's choice</div>
      <div className="flex gap-4 whitespace-nowrap overflow-x-auto px-6 _no-scrollbar">
        {courses.length > 0
          ? courses?.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))
          : skeletons.map((_, index) => <CourseSkeleton key={index} />)}
      </div>
    </>
  );
};

export default Home;
