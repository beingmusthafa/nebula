import React, { useEffect, useState } from "react";
import LineChartComponent from "../../components/tutor/LineChart";
import AdminLoading from "../../components/admin/AdminLoading";
import CourseCard from "../../components/CourseCard";
import CourseSkeleton from "../../components/skeletons/CourseSkeleton";
import { Link, useNavigate } from "react-router-dom";
let monthNames = [
  "",
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
interface Course {
  _id: string;
  title: string;
  rating: number;
  ratingCount: number;
  price: number;
  discount: number;
  thumbnail: string;
  tutor: {
    name: string;
    image: string;
  };
}
const Stats = () => {
  const currentMonth = new Date().getMonth() + 1;
  let [currentEnrollments, setCurrentEnrollments] = useState(0);
  let [currentRevenue, setCurrentRevenue] = useState(0);
  let [loading, setLoading] = useState(true);
  let [enrollments, setEnrollments] = useState<number[]>([]);
  let [revenue, setRevenue] = useState<number[]>([]);
  let [months, setMonths] = useState<string[]>([]);
  let [topLoading, setTopLoading] = useState(true);
  let [topCourses, setTopCourses] = useState<{ data: Course; count: number }[]>(
    []
  );
  const skeletons = new Array(5).fill(0);
  const navigate = useNavigate();
  const getGraphData = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/admin/get-graph-data",
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      setLoading(false);
      if (!res.success) throw new Error(res.message);
      console.log(res.courseEnrollmentData);
      let enrollmentArray: number[] = [];
      let revenueArray: number[] = [];
      let monthArray: string[] = [];
      res.courseEnrollmentData.forEach((data: any) => {
        enrollmentArray.push(data.count);
        revenueArray.push(data.revenue);
        monthArray.push(monthNames[data.month]);
        if (data.month === currentMonth) {
          setCurrentEnrollments(data.count);
          setCurrentRevenue(data.revenue);
        }
      });
      setEnrollments(enrollmentArray);
      setRevenue(revenueArray);
      setMonths(monthArray);
    } catch (error) {
      console.log(error);
    }
  };
  const fetchTopCourses = async () => {
    try {
      setTopLoading(true);
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/admin/get-top-courses",
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      setTopLoading(false);
      console.log({ top: res.courses });
      if (!res.success) throw new Error(res.message);
      setTopCourses(res.courses);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getGraphData();
    fetchTopCourses();
  }, []);
  console.log({ enrollments, revenue, months });
  return loading ? (
    <AdminLoading />
  ) : (
    <>
      <Link to={"/admin/stats/reports"} className="_fill-btn-black">
        Reports
      </Link>
      <div className="flex flex-col md:flex-row justify-center h-80 my-10">
        <div className="h-80 w-full md:w-[50vw]">
          <LineChartComponent
            data1={enrollments}
            data2={revenue}
            xLabels={months}
          />
        </div>
        <div className="flex flex-row md:flex-col justify-evenly">
          <div className="h-fit flex flex-col items-center p-2 border-4 w-32 rounded-2xl border-cyan-300">
            <p className="text-slate-500">Enrollments</p>
            <p className="font-bold text-2xl text-slate-700">
              {currentEnrollments}
            </p>
          </div>
          <div className="h-fit flex flex-col items-center p-2 border-4 w-32 rounded-2xl border-cyan-300">
            <p className="text-slate-500">Revenue</p>
            <p className="font-bold text-2xl text-slate-700">
              &#8377; {currentRevenue}
            </p>
          </div>
          <div className="h-fit flex flex-col items-center p-2 border-4 w-32 rounded-2xl border-cyan-300">
            <p className="text-slate-500">Earnings</p>
            <p className="font-bold text-2xl text-slate-700">
              &#8377; {Math.round((currentRevenue / 100) * 20)}
            </p>
          </div>
        </div>
      </div>
      <div className="_section-title">Bestselling courses</div>
      {topLoading ? (
        <div className="flex gap-4 px-6 justify-start flex-wrap bg-white">
          {skeletons.map((_, index) => (
            <CourseSkeleton key={index} />
          ))}
        </div>
      ) : topCourses?.length > 0 ? (
        <>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-6 justify-start flex-wrap bg-white">
            {topCourses?.map((course) => (
              <CourseCard
                redirectTo={"/tutor/manage-course-content/" + course.data?._id}
                key={course.data?._id}
                course={course.data}
                showTutor={false}
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-2xl text-slate-400 _font-dm-display w-full text-center my-24">
          No top courses
        </p>
      )}
    </>
  );
};

export default Stats;
