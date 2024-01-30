import React from "react";
import { motion } from "framer-motion";

const CourseSkeleton = () => {
  return (
    <div className="flex flex-col items-start w-fit gap-2">
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, repeatType: "mirror", repeat: Infinity }}
        className=" h-36 bg-slate-300"
        style={{ width: 270 }}
      ></motion.div>
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, repeatType: "mirror", repeat: Infinity }}
        className="w-80 h-4 bg-slate-300"
        style={{ width: 270 }}
      ></motion.div>
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, repeatType: "mirror", repeat: Infinity }}
        className="w-48 h-4 bg-slate-300"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, repeatType: "mirror", repeat: Infinity }}
        className="w-48 h-4 bg-slate-300"
      ></motion.div>
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, repeatType: "mirror", repeat: Infinity }}
        className="w-20 h-4 bg-slate-300"
      ></motion.div>
    </div>
  );
};

export default CourseSkeleton;
