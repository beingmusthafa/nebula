import React from "react";
import { motion } from "framer-motion";

const BannerTableRowSkeleton = () => {
  return (
    <motion.tr
      initial={{ opacity: 0.5 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.5,
        repeatType: "mirror",
        repeat: Infinity,
      }}
    >
      <td className="w-52">
        <div className="h-16 w-52 bg-slate-300"></div>
      </td>
      <td className="text-center">
        <div className="h-6 w-12 mx-auto bg-slate-300"></div>
      </td>
      <td className="text-center">
        <div className="h-6 w-32 mx-auto bg-slate-300"></div>
      </td>
      <td className="text-center">
        <div className="flex items-center justify-center gap-4">
          <div className="h-6 w-14 mx-auto bg-slate-300"></div>
        </div>
      </td>
    </motion.tr>
  );
};

export default BannerTableRowSkeleton;
