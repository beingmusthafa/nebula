import React, { useState, useEffect } from "react";
import CourseCard from "../../components/CourseCard";
import CourseSkeleton from "../../components/skeletons/CourseSkeleton";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

interface Course {
  _id: string;
  title: string;
  rating: number;
  ratingCount: number;
  price: number;
  thumbnail: string;
  tutor: {
    name: string;
    image: string;
  };
}
const TutorDashboard = () => {
  let skeletons = new Array(7).fill(0);
  let [courses, setCourses] = useState<Course[]>([]);
  const fetchCourses = async () => {
    try {
      const res = await fetch("/api/tutor/get-all-courses").then((res) =>
        res.json()
      );
      if (!res.success) return toast.error(res.message);
      setCourses(res.docs);
      console.log(res.docs);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    fetchCourses();
  });
  return (
    <>
      <Link to="/tutor/add-course" className="_fill-btn-blue">
        Add course
      </Link>
      <div className="_section-title">Your courses</div>
      <div className="flex gap-4 px-6 justify-start flex-wrap bg-white">
        {courses.length > 0
          ? courses?.map((course, index) => (
              <CourseCard
                key={index}
                course={course}
                showTutor={false}
                extraElement={
                  <div className="flex gap-2">
                    <button className="_fill-btn-blue">
                      <i className="bx bx-trash-alt text-base"></i>
                    </button>
                    <button className="_fill-btn-blue">
                      <i className="bx bx-edit text-base"></i>
                    </button>
                  </div>
                }
              />
            ))
          : skeletons.map((_, index) => <CourseSkeleton key={index} />)}
      </div>
    </>
  );
};

export default TutorDashboard;
