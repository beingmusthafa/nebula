import { motion } from "framer-motion";

const ChaptersAccordionSkeletion = () => {
  return (
    <>
      <div className="flex flex-col w-full items-center gap-4 my-20">
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.7,
            repeatType: "mirror",
            repeat: Infinity,
          }}
          className="border-2 flex flex-col items-center bg-slate-300 h-6 w-11/12 md:w-2/3 p-2"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.7,
            repeatType: "mirror",
            repeat: Infinity,
          }}
          className="border-2 flex flex-col items-center bg-slate-300 h-6 w-11/12 md:w-2/3 p-2"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.7,
            repeatType: "mirror",
            repeat: Infinity,
          }}
          className="border-2 flex flex-col items-center bg-slate-300 h-6 w-11/12 md:w-2/3 p-2"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.7,
            repeatType: "mirror",
            repeat: Infinity,
          }}
          className="border-2 flex flex-col items-center bg-slate-300 h-6 w-11/12 md:w-2/3 p-2"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.7,
            repeatType: "mirror",
            repeat: Infinity,
          }}
          className="border-2 flex flex-col items-center bg-slate-300 h-6 w-11/12 md:w-2/3 p-2"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.7,
            repeatType: "mirror",
            repeat: Infinity,
          }}
          className="border-2 flex flex-col items-center bg-slate-300 h-6 w-11/12 md:w-2/3 p-2"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0.3 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.7,
            repeatType: "mirror",
            repeat: Infinity,
          }}
          className="border-2 flex flex-col items-center bg-slate-300 h-6 w-11/12 md:w-2/3 p-2"
        ></motion.div>
      </div>
    </>
  );
};

export default ChaptersAccordionSkeletion;
