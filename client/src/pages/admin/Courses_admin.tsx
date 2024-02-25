import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CourseSkeleton from "../../components/skeletons/CourseSkeleton";
import CourseCard from "../../components/CourseCard";
import { toast } from "react-toastify";
import ConfirmationPopup_Admin from "../../components/ConfirmationPopup_Admin";
interface Course {
  _id: string;
  title: string;
  rating: number;
  ratingCount: number;
  price: number;
  discount: number;
  thumbnail: string;
  isBlocked: string;
  status: string;
  tutor: {
    name: string;
    image: string;
  };
}
const Courses_admin = () => {
  let [pendingLoading, setPendingLoading] = useState(true);
  let [pendingCourses, setPendingCourses] = useState<Course[]>([]);
  let [publishedLoading, setPublishedLoading] = useState(true);
  let [publishedCourses, setPublishedCourses] = useState<Course[]>([]);
  const skeletons = new Array(5).fill(0);
  const fetchPendingCourses = async () => {
    try {
      setPendingLoading(true);
      const res = await fetch("/api/admin/get-pending-courses").then((res) =>
        res.json()
      );
      if (!res.success) throw new Error(res.message);
      setPendingCourses(res.courses);
      setPendingLoading(false);
    } catch (error) {
      setPendingLoading(false);
      console.log(error);
      toast.error("Something went wrong");
    }
  };
  const fetchPublishedCourses = async () => {
    try {
      setPendingLoading(true);
      const res = await fetch("/api/admin/get-published-courses").then((res) =>
        res.json()
      );
      if (!res.success) throw new Error(res.message);
      setPublishedCourses(res.courses);
      setPublishedLoading(false);
    } catch (error) {
      setPendingLoading(false);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    fetchPendingCourses();
    fetchPublishedCourses();
  }, []);

  return (
    <>
      <form
        action=""
        className="md:flex w-fit mx-auto justify-center border border-black py-1 px-4 mb-10 rounded-full sticky top-10 bg-white hidden"
      >
        <input
          type="text"
          placeholder="Search for courses"
          className=" pl-4 w-44 md:w-80 border-0"
        />
        <button className="ml-2">
          <i className="bx bx-search-alt-2 text-lg"></i>
        </button>
      </form>
      <Link to="/admin/courses/categories" className="flex items-center w-full">
        <button className="_fill-btn-black">Categories</button>
      </Link>
      <div className="_section-title">Pending courses</div>
      {pendingLoading ? (
        <div className="flex gap-4 px-6 justify-start flex-wrap bg-white">
          {skeletons.map((_, index) => (
            <CourseSkeleton key={index} />
          ))}
        </div>
      ) : pendingCourses.length > 0 ? (
        <>
          <div className="flex gap-4 px-6 justify-start flex-wrap bg-white">
            {pendingCourses?.map((course) => (
              <CourseCard
                showPrice={false}
                redirectTo={"/admin/courses/pending/" + course._id}
                key={course._id}
                course={course}
                showTutor={false}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-2xl text-slate-400 _font-dm-display w-full text-center my-24">
          No pending courses
        </p>
      )}
      <div className="_section-title">Published courses</div>
      {publishedLoading ? (
        <div className="flex gap-4 px-6 justify-start flex-wrap bg-white">
          {skeletons.map((_, index) => (
            <CourseSkeleton key={index} />
          ))}
        </div>
      ) : publishedCourses.length > 0 ? (
        <>
          <div className="flex gap-4 px-6 justify-start flex-wrap bg-white">
            {publishedCourses?.map((course) => (
              <CourseCard
                showPrice={false}
                redirectTo={"/admin/courses/published/" + course._id}
                key={course._id}
                course={course}
                showTutor={false}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-2xl text-slate-400 _font-dm-display w-full text-center my-24">
          No published courses
        </p>
      )}
    </>
  );
};

export default Courses_admin;
