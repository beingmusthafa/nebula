import React from "react";
import RatingStars from "../RatingStars";
import { useSelector } from "react-redux";

interface Props {
  review: {
    _id: string;
    user: {
      _id: string;
      name: string;
      image: string;
    };
    rating: number;
    comment: string;
  };
  onEdit: () => void;
  onDelete: () => void;
}
const ReviewCard: React.FC<Props> = ({ review, onEdit, onDelete }) => {
  const { currentUser } = useSelector((state: any) => state.user);
  return (
    <div className="flex flex-col gap-2 border-2 border-sky-300 p-6 rounded-2xl _bg-light min-w-fit">
      <div className="flex items-center gap-4 justify-between">
        <div className="flex gap-4 items-center">
          <img
            src={review.user.image}
            alt="User image"
            className="h-12 rounded-full"
          />
          <p className="font-semibold text-slate-500 text-base max-w-52 overflow-hidden text-ellipsis">
            {review.user.name}
          </p>
        </div>
        {currentUser?._id === review.user._id && (
          <div className="flex gap-2">
            <i
              onClick={onDelete}
              className="bx bx-trash-alt cursor-pointer text-xl text-red-600"
            ></i>
            <i
              onClick={onEdit}
              className="bx bx-edit cursor-pointer text-xl text-blue-500"
            ></i>
          </div>
        )}
      </div>
      <RatingStars rating={review.rating} starSize={1.5} />
      <p className="max-w-80 text-wrap overflow-hidden break-words">
        {review.comment}
      </p>
    </div>
  );
};

export default ReviewCard;
