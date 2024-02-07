import { motion } from "framer-motion";

const TutorDetailsSkeletion = () => {
  return (
    <div className="flex flex-col w-4/5 md:w-1/2 mx-auto mt-10 p-6 rounded-2xl">
      <div className="flex items-start">
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.7,
            repeatType: "mirror",
            repeat: Infinity,
          }}
          className=" h-24 w-24 md:h-32 md:w-32 rounded-full bg-slate-300"
        ></motion.div>
        <div className="flex flex-col gap-4 h-full w-3/5 mx-auto">
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.7,
              repeatType: "mirror",
              repeat: Infinity,
            }}
            className="h-6 w-full bg-slate-300 "
          ></motion.div>
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.7,
              repeatType: "mirror",
              repeat: Infinity,
            }}
            className="h-6 w-full bg-slate-300 "
          ></motion.div>
          <motion.div
            initial={{ opacity: 0.3 }}
            animate={{ opacity: 1 }}
            transition={{
              duration: 0.7,
              repeatType: "mirror",
              repeat: Infinity,
            }}
            className="h-6 w-full bg-slate-300 "
          ></motion.div>
        </div>
      </div>
    </div>
  );
};

export default TutorDetailsSkeletion;
