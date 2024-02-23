import React, { ReactNode, useState } from "react";
import RatingStars from "../RatingStars";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Props {
  showTutor?: boolean;
  course: {
    _id: string;
    title: string;
    rating: number;
    ratingCount: number;
    price: number;
    discount: number;
    thumbnail: string;
    tutor: {
      name: string;
      image: string;
    };
  };
  showPrice?: boolean;
  extraElements?: ReactNode;
  redirectTo?: string;
}

const CourseCard: React.FC<Props> = ({
  course,
  showTutor = true,
  extraElements,
  redirectTo,
  showPrice = true,
}) => {
  let [showExtraElements, setShowExtraElements] = useState(false);
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
      {extraElements ? (
        <div className="flex justify-between items-center w-full pr-4 h-fit">
          {showPrice && (
            <>
              <p className="font-bold text-sm line-through">
                &#8377; {course.price}
              </p>
              <p className="font-bold text-lg text-green-600">
                &#8377; {course.price - course.discount}
              </p>
            </>
          )}

          <div onClick={(e) => e.stopPropagation()} className="relative">
            <i
              onClick={() => setShowExtraElements(!showExtraElements)}
              className="bx bx-dots-horizontal text-4xl"
            ></i>
            {showExtraElements && (
              <div
                onClick={(e) => {
                  e.stopPropagation();
                  setShowExtraElements(false);
                }}
                className="flex bg-white flex-col-gap-2 absolute bottom-12 border p-2"
              >
                {extraElements}
              </div>
            )}
          </div>
        </div>
      ) : course.discount > 0 ? (
        showPrice && (
          <div className="flex gap-2 items-center">
            <p className="font-bold text-sm line-through">
              &#8377; {course.price}
            </p>
            <p className="font-bold text-lg text-green-600">
              &#8377; {course.price - course.discount}
            </p>
          </div>
        )
      ) : (
        showPrice && <p className="font-bold text-lg">&#8377; {course.price}</p>
      )}
    </div>
  );
};

export default CourseCard;
