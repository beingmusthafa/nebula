import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";

interface Exercise {
  _id: string;
  question: string;
  options: string[];
  answer: number;
}
interface NextData {
  nextVideo: boolean;
  nextExercise: boolean;
  nextChapter: boolean;
}
const CourseExercise = () => {
  const { courseId, chapterId, exerciseOrder } = useParams();
  let [exercise, setExercise] = useState<Exercise | null>(null);
  let [nextData, setNextData] = useState<NextData | null>(null);
  let [loading, setLoading] = useState<boolean>(true);
  let [selected, setSelected] = useState<number | null>(0);
  let [showAnswer, setShowAnswer] = useState<boolean>(false);
  const navigate = useNavigate();
  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          `/api/get-course-exercise/${courseId}/${chapterId}/${exerciseOrder}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      let answerIndex;
      switch (res.exercise.answer) {
        case "A":
          answerIndex = 0;
          break;
        case "B":
          answerIndex = 1;
          break;
        case "C":
          answerIndex = 2;
          break;
        case "D":
          answerIndex = 3;
          break;
      }
      setExercise({ ...res.exercise, answer: answerIndex });
      setNextData(res.nextData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  console.log({ nextData });
  useEffect(() => {
    getData();
  }, []);
  const handleNext = () => {
    if (nextData?.nextExercise) {
      window.location.href = `/my-courses/learn/${courseId}/${chapterId}/exercise/${
        Number(exerciseOrder)! + 1
      }`;
    } else if (nextData?.nextChapter) {
      window.location.href = `/my-courses/learn/${courseId}/${nextData.nextChapter}`;
    } else {
      window.location.href = "/my-courses/learn/" + courseId;
    }
  };
  return loading ? (
    <Loading />
  ) : (
    <div className="h-full w-full flex items-center justify-center ">
      <div className="flex flex-col _screen-center _no-scrollbar _border-blue-black-gradient2 border-4 rounded-lg p-6 min-w-64 min-h-fit">
        <p className="font-semibold text-base mb-8 text-center">
          {exercise?.question}
        </p>
        {exercise?.options.map((option, index) => {
          if (showAnswer && exercise?.answer === index) {
            return (
              <div
                key={index}
                className="p-2 rounded-full my-2 text-base font-bold border-2 text-center _transition-0-3 text-white bg-green-500 border-green-500"
              >
                {option}
              </div>
            );
          } else if (
            showAnswer &&
            selected !== exercise?.answer &&
            selected === index
          ) {
            return (
              <div className="p-2 rounded-full my-2 text-base font-bold border-2 text-center _transition-0-3 text-white bg-red-500 border-red-500">
                {option}
              </div>
            );
          } else {
            return (
              <div
                onClick={() => {
                  setSelected(index);
                  setShowAnswer(true);
                }}
                className="p-2 rounded-full my-2 text-base font-bold border-2 border-slate-400 text-center _transition-0-3 hover:text-white hover:bg-sky-500 hover:border-sky-500"
              >
                {option}
              </div>
            );
          }
        })}
        {showAnswer && (
          <button
            onClick={handleNext}
            className="_fill-btn-black w-fit mx-auto mt-4"
          >
            Proceed
          </button>
        )}
      </div>
    </div>
  );
};

export default CourseExercise;
