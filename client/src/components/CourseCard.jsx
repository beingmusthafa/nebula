import React from "react";
import RatingStars from "./RatingStars";

const CourseCard = ({ course }) => {
  return (
    <div className="flex flex-col items-start w-fit">
      <img src={course.thumbnail} className="object-cover w-80 h-36" alt="" />
      <div className="font-bold text-lg text-wrap" style={{ width: 270 }}>
        {course.title}
      </div>
      <div className="flex gap-2 items-center">
        <img src={course.tutor.image} alt="" className="w-6 h-6 rounded-full" />
        <p>{course.tutor.name}</p>
      </div>
      <div className="flex items-center">
        <span className="_font-tilt-warp mr-2 text-lg">{course.rating}</span>
        <RatingStars rating={course.rating} />
      </div>
      <p className="font-bold text-lg">{course.price}</p>
    </div>
  );
};

export default CourseCard;
