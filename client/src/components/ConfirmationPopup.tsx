import React, { SetStateAction } from "react";

interface Props {
  confirmText: string;
  onConfirm: (p: any) => any | React.Dispatch<SetStateAction<any>>;
  onCancel: (p: any) => any | React.Dispatch<SetStateAction<any>>;
  isActionPositive?: boolean;
}
const ConfirmationPopup: React.FC<Props> = ({
  confirmText,
  onConfirm,
  onCancel,
  isActionPositive = false,
}) => {
  return (
    <div className="flex fixed w-full justify-center">
      <div className="flex flex-col p-6 fixed top-1/3 border-2 border-black bg-white max-w-96">
        <div className="text-base font-medium">{confirmText}</div>
        <div className="flex gap-10 mx-auto mt-4">
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
      </div>
    </div>
  );
};

export default ConfirmationPopup;
