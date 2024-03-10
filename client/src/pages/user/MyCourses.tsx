import React, { useEffect, useState } from "react";
import CourseCard from "../../components/CourseCard";
import CourseSkeleton from "../../components/skeletons/CourseSkeleton";
import ICourse from "../../interfaces/courses.interface";

const MyCourses = () => {
  let [courses, setCourses] = useState<ICourse[]>([]);
  let [loading, setLoading] = useState(true);
  let skeletons = new Array(10).fill(0);
  const getCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/get-purchased-courses",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      setLoading(false);
      if (!res.success) throw new Error(res.message);
      setCourses(res.courses);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCourses();
  }, []);

  return (
    <>
      <h1 className="_section-title">My courses</h1>
      <div className="flex flex-col items-center md:flex-row gap-4 px-6 justify-start flex-wrap bg-white mt-6">
        {loading ? (
          skeletons.map((_, i) => <CourseSkeleton key={i} />)
        ) : courses.length > 0 ? (
          courses.map((course) => (
            <CourseCard
              course={course}
              key={course._id}
              showPrice={false}
              redirectTo={`/my-courses/learn/${course._id}`}
            />
          ))
        ) : (
          <p className="text-center w-full text-2xl _font-dm-display text-slate-400 my-32">
            No enrolled courses
          </p>
        )}
      </div>
    </>
  );
};

export default MyCourses;
