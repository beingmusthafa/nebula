import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
const CourseCompleted = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  setTimeout(() => {
    navigate("/my-courses/learn/" + courseId);
  }, 3000);
  return (
    <div className="fixed h-full w-full flex flex-col  items-center pt-64 md:pt-32">
      <motion.i
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="bx bxs-party text-sky-500 text-5xl mb-10"
        style={{ fontSize: "5rem" }}
      ></motion.i>
      <motion.h1
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7 }}
        className="_font-dm-display text-3xl"
      >
        Course completed!
      </motion.h1>
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="mt-4 text-base w-72 md:w-96 text-center"
      >
        Keep up the pace and never stop learning. Redirecting to course home
        page...
      </motion.p>
    </div>
  );
};

export default CourseCompleted;
