import React, { useState, useEffect } from "react";
import CourseCard from "../../components/CourseCard";
import CourseSkeleton from "../../components/skeletons/CourseSkeleton";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationPopup from "../../components/ConfirmationPopup";
import LineChartComponent from "../../components/tutor/LineChart";
import EditPriceDiscount from "../../components/tutor/EditPriceDiscount";

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

const TutorDashboard = () => {
  let skeletons = new Array(4).fill(0);
  const navigate = useNavigate();
  let [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  let [showMakePublishConfirm, setShowMakePublishConfirm] = useState(false);
  let [showCancelPublishConfirm, setShowCancelPublishConfirm] = useState(false);
  let [showEditPricingForm, setShowEditPricingForm] = useState(false);
  let [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  let [creatingCourses, setCreatingCourses] = useState<Course[]>([]);
  let [pendingCourses, setPendingCourses] = useState<Course[]>([]);
  let [publishedCourses, setPublishedCourses] = useState<Course[]>([]);
  let [creatingLoading, setCreatingLoading] = useState(false);
  let [pendingLoading, setPendingLoading] = useState(false);
  let [publishedLoading, setPublishedLoading] = useState(false);
  //stats related states
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
  const getGraphData = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/tutor/get-graph-data",
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
  const fetchCreatingCourses = async () => {
    try {
      setCreatingLoading(true);
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/tutor/get-creating-courses",
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) return toast.error(res.message);
      setCreatingCourses(res.courses);
      setCreatingLoading(false);
    } catch (error) {
      setCreatingLoading(false);
      toast.error("Something went wrong");
    }
  };
  const fetchPendingCourses = async () => {
    try {
      setPendingLoading(true);
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/tutor/get-pending-courses",
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) return toast.error(res.message);
      setPendingCourses(res.courses);
      setPendingLoading(false);
    } catch (error) {
      setPendingLoading(false);
      toast.error("Something went wrong");
    }
  };
  const fetchPublishedCourses = async () => {
    try {
      setPublishedLoading(true);
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/tutor/get-published-courses",
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) return toast.error(res.message);
      setPublishedCourses(res.courses);
      setPublishedLoading(false);
    } catch (error) {
      setPublishedLoading(false);
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    fetchCreatingCourses();
    fetchPendingCourses();
    fetchPublishedCourses();
    getGraphData();
    fetchTopCourses();
  }, []);
  const makePublishRequest = async () => {
    setShowMakePublishConfirm(false);
    const toastId = toast.loading("Making publish request");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          "/api/tutor/make-publish-request/" +
          selectedCourse?._id,
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          method: "PATCH",
        }
      ).then((res) => res.json());
      toast.dismiss(toastId);
      if (!res.success) throw new Error(res.message);
      fetchCreatingCourses();
      fetchPendingCourses();
      setPublishedLoading(false);
      setCreatingLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const cancelPublishRequest = async () => {
    setShowCancelPublishConfirm(false);
    const toastId = toast.loading("Cancelling publish request");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          "/api/tutor/cancel-publish-request/" +
          selectedCourse?._id,
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          method: "PATCH",
        }
      ).then((res) => res.json());
      toast.dismiss(toastId);
      console.log({ res });
      if (!res.success) throw new Error(res.message);
      fetchCreatingCourses();
      fetchPendingCourses();
      setPublishedLoading(false);
      setCreatingLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const handleDelete = async () => {
    const toastId = toast.loading("Deleting course");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          "/api/tutor/delete-course/" +
          selectedCourse?._id,
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          method: "DELETE",
        }
      ).then((res) => res.json());
      toast.dismiss(toastId);
      if (!res.success) return toast.error(res.message);
      toast.success(res.message);
      fetchCreatingCourses();
      setShowDeleteConfirm(false);
      setSelectedCourse(null);
    } catch (error) {
      toast.dismiss(toastId);
      console.log(error);
    }
  };
  return (
    <>
      {showDeleteConfirm && (
        <ConfirmationPopup
          isActionPositive={false}
          onCancel={() => setShowDeleteConfirm(false)}
          confirmText={`Delete this course?: ${selectedCourse?.title}`}
          onConfirm={handleDelete}
        />
      )}
      {showMakePublishConfirm && (
        <ConfirmationPopup
          isActionPositive={false}
          onCancel={() => setShowMakePublishConfirm(false)}
          confirmText={`Make publish request for this course?: ${selectedCourse?.title}`}
          onConfirm={makePublishRequest}
        />
      )}
      {showCancelPublishConfirm && (
        <ConfirmationPopup
          isActionPositive={false}
          onCancel={() => setShowCancelPublishConfirm(false)}
          confirmText={`Cancel publish request for this course?: ${selectedCourse?.title}`}
          onConfirm={cancelPublishRequest}
        />
      )}
      {showEditPricingForm && (
        <EditPriceDiscount
          course={selectedCourse!}
          setShow={setShowEditPricingForm}
          fetchData={fetchPublishedCourses}
        />
      )}
      {}
      <div className="flex items-center gap-2 p-4">
        <Link to="/tutor/reports" className="_fill-btn-black">
          Reports
        </Link>
        <Link to="/tutor/add-course" className="_fill-btn-blue">
          Add course
        </Link>
      </div>
      {loading ? (
        <p className="_font-dm-display my-40 text-xl text-center text-slate-500">
          Loading graph data...
        </p>
      ) : (
        <div className="flex flex-col md:flex-row justify-center h-80 my-10">
          <div className="h-80 w-full md:w-[50vw]">
            <LineChartComponent
              data1={enrollments}
              data2={revenue}
              xLabels={months}
            />
          </div>
          <div className="flex flex-row md:flex-col justify-evenly">
            <div className="h-fit flex flex-col items-center p-2 border-4 w-28 md:w-32 rounded-2xl border-cyan-300">
              <p className="text-slate-500">Enrollments</p>
              <p className="font-bold text-xl md:text-2xl text-slate-700">
                {currentEnrollments}
              </p>
            </div>
            <div className="h-fit flex flex-col items-center p-2 border-4 w-28 md:w-32 rounded-2xl border-cyan-300">
              <p className="text-slate-500">Revenue</p>
              <p className="font-bold text-xl md:text-2xl text-slate-700">
                &#8377; {currentRevenue}
              </p>
            </div>
            <div className="h-fit flex flex-col items-center p-2 border-4 w-28 md:w-32 rounded-2xl border-cyan-300">
              <p className="text-slate-500">Earnings</p>
              <p className="font-bold text-xl md:text-2xl text-slate-700">
                &#8377; {Math.round((currentRevenue / 100) * 20)}
              </p>
            </div>
          </div>
        </div>
      )}

      <div className="_section-title">Bestselling courses</div>
      {topLoading ? (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-6 justify-start flex-wrap bg-white">
          {skeletons.map((_, index) => (
            <CourseSkeleton key={index} />
          ))}
        </div>
      ) : topCourses?.length > 0 ? (
        <>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-6 justify-start flex-wrap bg-white">
            {topCourses?.map((course) => (
              <CourseCard
                redirectTo={"/tutor/course/" + course.data?._id}
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
      <div className="_section-title">Courses under creation</div>
      {creatingLoading ? (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-6 justify-start flex-wrap bg-white">
          {skeletons.map((_, index) => (
            <CourseSkeleton key={index} />
          ))}
        </div>
      ) : creatingCourses.length > 0 ? (
        <>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-6 justify-start flex-wrap bg-white">
            {creatingCourses?.map((course) => (
              <CourseCard
                redirectTo={"/tutor/manage-course-content/" + course._id}
                key={course._id}
                course={course}
                showTutor={false}
                extraElements={
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setSelectedCourse(course);
                      }}
                      className="_fill-btn-red"
                    >
                      <i className="bx bx-trash-alt text-base"></i>
                    </button>
                    <button
                      onClick={() =>
                        navigate("/tutor/edit-course/" + course._id)
                      }
                      className="_fill-btn-blue"
                    >
                      <i className="bx bx-edit text-base"></i>
                    </button>
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowMakePublishConfirm(true);
                      }}
                      className="_fill-btn-blue"
                    >
                      <i className="bx bx-upvote text-base"></i>
                    </button>
                  </div>
                }
              />
            ))}
          </div>
        </>
      ) : (
        <p className="text-2xl text-slate-400 _font-dm-display w-full text-center my-24">
          No creating courses
        </p>
      )}
      <div className="_section-title">Pending courses</div>
      {pendingLoading ? (
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-6 justify-start flex-wrap bg-white">
          {skeletons.map((_, index) => (
            <CourseSkeleton key={index} />
          ))}
        </div>
      ) : pendingCourses.length > 0 ? (
        <>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-6 justify-start flex-wrap bg-white">
            {pendingCourses?.map((course) => (
              <CourseCard
                redirectTo={"/tutor/course/" + course._id}
                key={course._id}
                course={course}
                showTutor={false}
                extraElements={
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowCancelPublishConfirm(true);
                      }}
                      className="_fill-btn-blue"
                    >
                      <i className="bx bx-x-circle text-base"></i>
                    </button>
                  </div>
                }
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
        <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-6 justify-start flex-wrap bg-white">
          {skeletons.map((_, index) => (
            <CourseSkeleton key={index} />
          ))}
        </div>
      ) : publishedCourses.length > 0 ? (
        <>
          <div className="flex flex-col md:flex-row items-center md:items-start gap-4 px-6 justify-start flex-wrap bg-white">
            {publishedCourses?.map((course) => (
              <CourseCard
                redirectTo={"/tutor/course/" + course._id}
                key={course._id}
                course={course}
                showTutor={false}
                extraElements={
                  <div className="flex flex-col gap-2">
                    <button
                      onClick={() => {
                        setSelectedCourse(course);
                        setShowEditPricingForm(true);
                      }}
                      className="_fill-btn-blue"
                    >
                      <i className="bx bx-edit text-base"></i>
                    </button>
                  </div>
                }
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

export default TutorDashboard;
