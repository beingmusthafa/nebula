import React from "react";

interface Props {
  rating: number;
}
const RatingStars: React.FC<Props> = ({ rating }) => {
  let emptyStars = new Array(Math.round(5 - rating)).fill(0);
  let fullStars = [];
  let halfStars = [];
  while (rating >= 0.5) {
    if (rating >= 1) {
      fullStars.push(0);
      rating--;
    } else if (rating >= 0.5) {
      halfStars.push(0);
      rating -= 0.5;
    }
  }
  return (
    <div className="flex items-center gap-1">
      {fullStars.map((_, index) => (
        <i key={index} className="bx bxs-star text-yellow-500"></i>
      ))}
      {halfStars.map((_, index) => (
        <i key={index} className="bx bxs-star-half text-yellow-500"></i>
      ))}
      {emptyStars.map((_, index) => (
        <i key={index} className="bx bxs-star text-slate-400"></i>
      ))}
    </div>
  );
};

export default RatingStars;
