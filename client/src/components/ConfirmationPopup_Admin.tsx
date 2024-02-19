import React, { SetStateAction } from "react";
import { motion } from "framer-motion";

interface Props {
  confirmText: string;
  onConfirm: (p: any) => any | React.Dispatch<SetStateAction<any>>;
  onCancel: (p: any) => any | React.Dispatch<SetStateAction<any>>;
  isActionPositive?: boolean;
}
const ConfirmationPopup_Admin: React.FC<Props> = ({
  confirmText,
  onConfirm,
  onCancel,
  isActionPositive = false,
}) => {
  return (
    <div className="flex fixed w-full justify-center _admin-center">
      <motion.div
        initial={{ y: 150, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        style={{ zIndex: 15 }}
        className="_screen-center flex flex-col p-6 border-4 _border-blue-black-gradient2 bg-white max-w-96"
      >
        <div className="text-base font-medium text-center">{confirmText}</div>
        <div className="flex gap-10 mx-auto mt-10">
          <button
            onClick={onCancel}
            className={isActionPositive ? "_fill-btn-red" : "_fill-btn-black"}
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className={isActionPositive ? "_fill-btn-black" : "_fill-btn-red"}
          >
            Yes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ConfirmationPopup_Admin;
