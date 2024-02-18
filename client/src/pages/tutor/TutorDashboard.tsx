import React, { useState, useEffect } from "react";
import CourseCard from "../../components/CourseCard";
import CourseSkeleton from "../../components/skeletons/CourseSkeleton";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import ConfirmationPopup from "../../components/ConfirmationPopup";

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
  const navigate = useNavigate();
  let [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  let [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
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
  }, []);
  const handleDelete = async () => {
    const toastId = toast.loading("Deleting course");
    try {
      const res = await fetch(
        "/api/tutor/delete-course/" + selectedCourse?._id,
        {
          method: "DELETE",
        }
      ).then((res) => res.json());
      toast.dismiss(toastId);
      if (!res.success) return toast.error(res.message);
      toast.success(res.message);
      fetchCourses();
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
      <Link to="/tutor/add-course" className="_fill-btn-blue">
        Add course
      </Link>
      <div className="_section-title">Your courses</div>
      <div className="flex gap-4 px-6 justify-start flex-wrap bg-white">
        {courses.length > 0
          ? courses?.map((course) => (
              <CourseCard
                redirectTo={"/tutor/manage-course-content/" + course._id}
                key={course._id}
                course={course}
                showTutor={false}
                extraElement={
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setShowDeleteConfirm(true);
                        setSelectedCourse(course);
                      }}
                      className="_fill-btn-blue"
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
