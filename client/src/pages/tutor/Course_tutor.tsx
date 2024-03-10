import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import RatingStars from "../../components/RatingStars";
import Accordions from "../../components/Accordions";
import ChaptersAccordionSkeletion from "../../components/skeletons/ChaptersAccordionSkeletion";
import CourseDetailsSkeleton from "../../components/skeletons/CourseDetailsSkeleton";
import ICourse from "../../interfaces/courses.interface";
import IChapter from "../../interfaces/chapters.interface";
const Course_tutor = () => {
  const { id } = useParams();
  let [course, setCourse] = useState<ICourse | null>(null);
  let [loading, setLoading] = useState(true);
  let [chapters, setChapters] = useState<IChapter[] | null>(null);
  const navigate = useNavigate();
  useEffect(() => {
    try {
      setLoading(true);
      async function getCourse() {
        const res = await fetch(
          import.meta.env.VITE_API_BASE_URL + `/api/get-course-details/${id}`,
          {
            headers: {
              "Authorization": "Bearer " + localStorage.getItem("token"),
            },
          }
        ).then((res) => res.json());
        if (!res.success) return toast.error(res.message);
        setCourse(res.doc);
        setChapters(res.chapters);
        setLoading(false);
      }
      getCourse();
    } catch (error) {
      console.log(error);
    }
  }, []);
  const accordionData: { title: string; content: JSX.Element[] }[] = [];
  if (chapters) {
    chapters.forEach((chapter, i) => {
      let content: JSX.Element[] = [];
      chapter.videos.forEach((video, i) => {
        const mins = Math.floor(video.duration / 60);
        const seconds = Math.floor(video.duration % 60);
        content.push(
          <div
            key={i}
            className="flex justify-between w-11/12 py-2 border-t border-slate-500"
          >
            <div className="flex items-center">
              <i className="bx bx-video text-xl text-slate-500 mr-2"></i>
              {video.title}
            </div>
            <p>{`${mins}m ${seconds}s`}</p>
          </div>
        );
      });
      chapter.exercises.forEach((exercise, i) => {
        content.push(
          <div
            key={i}
            className="flex justify-between w-11/12 py-2 border-t border-slate-500"
          >
            <div className="flex items-center">
              <i className="bx bx-notepad text-xl text-slate-500 mr-2"></i>
              {`Exercise - ${i + 1}`}
            </div>
          </div>
        );
      });
      accordionData.push({
        title: `Chapter ${i + 1} - ${chapter.title}`,
        content,
      });
    });
  }
  return (
    <>
      {course ? (
        <>
          <div className="bg-gray-800 h-fit w-full flex  md:flex-row flex-col justify-center gap-20 p-10">
            <div className="flex flex-col text-white gap-2 order-2 md:order-1">
              <h1 className="_font-dm-display text-2xl">{course.title}</h1>
              <p className="text-wrap w-80 text-ellipsis overflow-hidden">
                {course.description}
              </p>
              <div className="flex gap-2 items-baseline">
                {course.discount > 0 ? (
                  <>
                    <p className="font-semibold text-bold text-xl line-through text-slate-300">
                      &#8377; {course.price}
                    </p>
                    <p className="font-bold text-bold text-2xl text-green-400">
                      &#8377; {course.price - course.discount}
                    </p>
                  </>
                ) : (
                  <p className="font-bold text-bold text-2xl ">
                    &#8377; {course.price}
                  </p>
                )}
              </div>
              <div className="flex">
                <p className="_font-tilt-warp text-lg mr-4">{course.rating}</p>
                <RatingStars rating={course.rating} starSize={1} />
              </div>
              <div className="flex gap-10">
                <div className="flex items-center text-base gap-2">
                  <i className="bx bx-time-five text-xl"></i>1 hour 10 minutes
                </div>
                <div className="flex items-center text-base gap-2">
                  <i className="bx bx-user-voice text-xl"></i>
                  {course.language}
                </div>
              </div>
            </div>

            <div className="flex flex-col order-1 md:order-2 md:sticky md:top-40">
              <img
                className="w-80 h-36 object-cover"
                src={course.thumbnail}
                alt=""
              />
            </div>
          </div>
          {course.benefits?.length! > 0 && (
            <>
              <h2 className="_section-title2">Course benefits</h2>
              <div className="flex flex-col items-start mx-auto px-10 gap-2">
                {course.benefits?.map((benefit, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-base text-wrap overflow-hidden text-ellipsis"
                    style={{ maxWidth: "90%" }}
                  >
                    <i className="bx bx-check text-2xl text-green-600"></i>
                    {benefit}
                  </div>
                ))}
              </div>
            </>
          )}
          {course.requirements?.length! > 0 && (
            <>
              <h2 className="_section-title2">Pre-requisites</h2>
              <div className="flex flex-col items-start mx-auto px-10 gap-2">
                {course.requirements?.map((requirement, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-2 text-base text-wrap overflow-hidden text-ellipsis"
                    style={{ maxWidth: "90%" }}
                  >
                    <i className="bx bx-info-circle text-2xl"></i>
                    {requirement}
                  </div>
                ))}
              </div>
            </>
          )}
          <div className="flex w-full p-4 justify-between">
            <div className="_font-dm-display text-xl w-fit">
              Course contents
            </div>
          </div>
        </>
      ) : (
        <CourseDetailsSkeleton />
      )}
      {chapters ? (
        chapters.length > 0 ? (
          <Accordions data={accordionData} />
        ) : (
          <p className="_font-dm-display my-32 text-xl text-center text-slate-500">
            No content added
          </p>
        )
      ) : (
        <ChaptersAccordionSkeletion />
      )}
    </>
  );
};

export default Course_tutor;
