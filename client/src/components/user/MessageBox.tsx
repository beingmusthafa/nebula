import React from "react";

interface Props {
  name: string;
  image: string;
  message: string;
  position: "right" | "left";
  date: string;
}
const MessageBox: React.FC<Props> = ({
  name,
  image,
  message,
  position,
  date,
}) => {
  return position === "right" ? (
    <div className="ml-auto rounded-br-none rounded-3xl  p-4 w-fit gap-2 max-w-72 md:max-w-96  flex items-start bg-lime-100 m-4 text-wrap break-words">
      <img src={image} className="h-8 w-8 rounded-full order-2" alt="" />
      <div className="flex flex-col items-start w-full order-1">
        <p className="font-semibold text-green-500 ml-auto">You</p>
        <p className="text-sm text-right my-1 ml-auto">{message}</p>
        <p className="text-xs text-slate-500 ml-auto">{date}</p>
      </div>
    </div>
  ) : (
    <div className="mr-auto rounded-bl-none rounded-3xl  p-4 w-fit gap-2 max-w-72 md:max-w-96  flex items-start bg-lime-100 m-4 text-wrap break-words">
      <img src={image} className="h-8 w-8 rounded-full" alt="" />
      <div className="flex flex-col items-start w-full">
        <p className="font-semibold text-slate-500">{name}</p>
        <p className="text-sm my-1">{message}</p>
        <p className="text-xs text-slate-500 mr-auto">{date}</p>
      </div>
    </div>
  );
};

export default MessageBox;
