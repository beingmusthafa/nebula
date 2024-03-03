import { motion } from "framer-motion";

interface Props {
  showFull?: boolean;
}
const CourseDetailsSkeleton: React.FC<Props> = ({ showFull = true }) => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0.3 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.7,
          repeatType: "mirror",
          repeat: Infinity,
        }}
        className="h-36 md:h-64 w-full bg-slate-300"
      ></motion.div>
      {showFull && (
        <>
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.7,
              repeatType: "mirror",
              repeat: Infinity,
            }}
            className="bg-slate-300 h-6 mr-auto w-1/4 mt-10 mb-4"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.7,
              repeatType: "mirror",
              repeat: Infinity,
            }}
            className="bg-slate-300 h-6 mr-auto w-1/2 my-4"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.7,
              repeatType: "mirror",
              repeat: Infinity,
            }}
            className="bg-slate-300 h-6 mr-auto w-1/2 my-4"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.7,
              repeatType: "mirror",
              repeat: Infinity,
            }}
            className="bg-slate-300 h-6 mr-auto w-1/2 my-4"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.7,
              repeatType: "mirror",
              repeat: Infinity,
            }}
            className="bg-slate-300 h-6 mr-auto w-1/4 mt-10 mb-4"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.7,
              repeatType: "mirror",
              repeat: Infinity,
            }}
            className="bg-slate-300 h-6 mr-auto w-1/2 my-4"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.7,
              repeatType: "mirror",
              repeat: Infinity,
            }}
            className="bg-slate-300 h-6 mr-auto w-1/2 my-4"
          ></motion.div>
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.7,
              repeatType: "mirror",
              repeat: Infinity,
            }}
            className="bg-slate-300 h-6 mr-auto w-1/2 my-4"
          ></motion.div>
        </>
      )}
    </>
  );
};

export default CourseDetailsSkeleton;
