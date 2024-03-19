import { Link } from "react-router-dom";

interface Enrollment {
  _id: string;
  course: { _id: string; title: string; thumbnail: string; price: number };
  createdAt: string;
  price: number;
}
interface Props {
  enrollment: Enrollment;
}
const EnrollmentCard: React.FC<Props> = ({ enrollment }) => {
  const enrollmentDate = new Date(enrollment.createdAt);
  return (
    <Link
      to={"/my-courses/learn/" + enrollment.course._id}
      className="w-full md:w-[50vw] p-6 border flex flex-col md:mx-auto mx-4"
    >
      <div className="flex justify-evenly items-center">
        <img
          src={enrollment.course.thumbnail}
          className="w-24 md:w-32"
          alt=""
        />
        <p className="w-32 md:w-44 break-words text-wrap font-semibold">
          {enrollment.course.title}
        </p>
      </div>
      <div className="flex justify-evenly items-center mt-2">
        <p className="font-semibold text-xl">&#8377; {enrollment.price}</p>
        <p className="font-semibold text-slate-500">
          Date:{" "}
          {`${enrollmentDate.getDate()}-${
            enrollmentDate.getMonth() + 1
          }-${enrollmentDate.getFullYear()}`}
        </p>
      </div>
    </Link>
  );
};

export default EnrollmentCard;
