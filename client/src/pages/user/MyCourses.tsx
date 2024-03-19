import React, { useEffect, useState } from "react";
import CourseCard from "../../components/CourseCard";
import CourseSkeleton from "../../components/skeletons/CourseSkeleton";
import ICourse from "../../interfaces/courses.interface";
import IProgress from "../../interfaces/progress.interface";

type CourseData = {
  progress: {
    course: string;
    chapter: string;
    target: number;
    videos: string[];
    exercises: string[];
  };
} & ICourse;
const MyCourses = () => {
  const [courses, setCourses] = useState<CourseData[]>([]);
  const [loading, setLoading] = useState(true);
  const [progressList, setProgressList] = useState<IProgress[]>([]);
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
      return res.courses;
    } catch (error) {
      console.log(error);
    }
  };
  const getProgress = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/get-all-progress",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      return res.progressList;
      console.log(res.progressList);
    } catch (error) {
      console.log(error);
    }
  };
  const getAndArrangeData = async () => {
    let [_courses, _progressList] = await Promise.all([
      getCourses(),
      getProgress(),
    ]);
    for (const course of _courses) {
      for (const progress of _progressList as IProgress[]) {
        if (course._id === progress.course) {
          course.progress = progress;
        }
      }
    }
    setCourses(_courses);
  };
  useEffect(() => {
    getAndArrangeData();
  }, []);

  return (
    <>
      <h1 className="_section-title">My courses</h1>
      <div className="flex flex-col items-center md:flex-row gap-4 px-6 justify-start flex-wrap bg-white mt-6">
        {loading ? (
          skeletons.map((_, i) => <CourseSkeleton key={i} />)
        ) : courses.length > 0 ? (
          courses.map((course) => {
            const completed =
              course.progress.videos.length + course.progress.exercises.length;
            const completedPercentage =
              Math.round((completed / course.progress.target) * 100) || 0;
            let color;
            if (completedPercentage >= 0 && completedPercentage <= 25) {
              color = "bg-red-300";
            } else if (completedPercentage > 25 && completedPercentage <= 50) {
              color = "bg-orange-400";
            } else if (completedPercentage > 50 && completedPercentage < 75) {
              color = "bg-yellow-400";
            } else {
              color = "bg-green-500";
            }
            return (
              <div className="flex flex-col items-center">
                <CourseCard
                  course={course}
                  key={course._id}
                  showPrice={false}
                  redirectTo={`/my-courses/learn/${course._id}`}
                />
                <p className="text-slate-400 font-semibold mr-auto mb-2">
                  {completedPercentage === 100
                    ? "COMPLETED"
                    : completedPercentage > 0
                    ? `${completedPercentage}% COMPLETED`
                    : "NOT STARTED"}
                </p>
                <div
                  style={{ width: `${completedPercentage}%` }}
                  className={"h-3 rounded-full  mr-auto " + color}
                ></div>
              </div>
            );
          })
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
