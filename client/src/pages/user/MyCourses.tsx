import React, { useEffect, useState } from "react";
import CourseCard from "../../components/CourseCard";
import CourseSkeleton from "../../components/skeletons/CourseSkeleton";

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
const MyCourses = () => {
  let [courses, setCourses] = useState<Course[]>([]);
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
      console.log(res.courses);
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
      <div className="flex gap-4 px-6 justify-start flex-wrap bg-white mt-6">
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
