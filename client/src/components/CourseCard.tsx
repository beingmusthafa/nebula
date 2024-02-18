import React, { ReactNode } from "react";
import RatingStars from "./RatingStars";
import { Link, useNavigate } from "react-router-dom";

interface Props {
  showTutor?: boolean;
  course: {
    _id: string;
    title: string;
    rating: number;
    ratingCount: number;
    price: number;
    thumbnail: string;
    tutor: {
      name: string;
      image: string;
    };
  };
  extraElement?: ReactNode;
  redirectTo?: string;
}

const CourseCard: React.FC<Props> = ({
  course,
  showTutor = true,
  extraElement,
  redirectTo,
}) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => navigate(redirectTo || `/course-details/${course._id}`)}
      className="flex flex-col items-start w-fit cursor-pointer"
    >
      <img src={course.thumbnail} className="object-cover w-64 h-36" alt="" />
      <div className="font-bold text-lg text-wrap" style={{ width: 270 }}>
        {course.title}
      </div>
      {showTutor && (
        <div className="flex gap-2 items-center">
          <img
            src={course.tutor.image}
            alt=""
            className="w-6 h-6 rounded-full"
          />
          <p>{course.tutor.name}</p>
        </div>
      )}
      <div className="flex items-center">
        <span className="_font-tilt-warp mr-2 text-lg">{course.rating}</span>
        <RatingStars rating={course.rating} />({course.ratingCount})
      </div>
      {extraElement ? (
        <div className="flex justify-between items-center w-full pr-4">
          <p className="font-bold text-lg">&#8377; {course.price}</p>
          <div onClick={(e) => e.stopPropagation()}>{extraElement}</div>
        </div>
      ) : (
        <p className="font-bold text-lg">&#8377; {course.price}</p>
      )}
    </div>
  );
};

export default CourseCard;
