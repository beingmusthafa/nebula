import React, { SetStateAction } from "react";

interface Exercise {
  question: string;
  options: string[];
  answer: string;
}
interface Props {
  exercise: Exercise;
  setShow: React.Dispatch<SetStateAction<boolean>>;
}
const ExercisePreview: React.FC<Props> = ({ exercise, setShow }) => {
  return (
    <div className="_admin-center">
      <div className="_screen-center border p-4 flex flex-col w-80 bg-white border-sky-500">
        <p className="font-semibold">Question</p>
        <p className="text-base mb-4">{exercise.question}</p>
        <div className="flex flex-col gap-2 text-base mb-4">
          <p className="font-semibold text-sm">Options</p>
          <p>
            {"A : "}
            {exercise.options[0]}
          </p>
          <p>
            {"B : "}
            {exercise.options[1]}
          </p>
          <p>
            {"C : "}
            {exercise.options[2]}
          </p>
          <p>
            {"D : "}
            {exercise.options[3]}
          </p>
        </div>

        <p className="font-semibold text-base">Answer: {exercise.answer}</p>
        <div className="w-full flex justify-center">
          <button
            onClick={() => setShow(false)}
            className="_fill-btn-black my-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExercisePreview;
