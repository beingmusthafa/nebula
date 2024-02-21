import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";

interface Video {
  _id: string;
  title: string;
  video: string;
  order: number;
}
interface NextData {
  nextVideo: boolean;
  nextExercise: boolean;
  nextChapter: boolean;
}
const CourseVideo = () => {
  const { courseId, chapterId, videoOrder } = useParams();
  let [video, setVideo] = useState<Video | null>(null);
  let [nextData, setNextData] = useState<NextData | null>(null);
  let [loading, setLoading] = useState<boolean>(true);
  console.log({ nextData });
  const navigate = useNavigate();
  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        `/api/get-course-video/${courseId}/${chapterId}/${videoOrder}`
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      setVideo(res.video);
      setNextData(res.nextData);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getData();
  }, []);
  const handleNext = () => {
    if (nextData?.nextVideo) {
      location.href = `/my-courses/learn/${courseId}/${chapterId}/video/${
        Number(videoOrder)! + 1
      }`;
    } else if (nextData?.nextExercise) {
      location.href = `/my-courses/learn/${courseId}/${chapterId}/exercise/1`;
    } else if (nextData?.nextChapter) {
      location.href = `/my-courses/learn/${courseId}/${nextData.nextChapter}/1`;
    } else {
      location.href = "/my-courses/learn/" + courseId;
    }
  };
  const handlePrev = () => {
    location.href = `/my-courses/learn/${courseId}/${chapterId}/video/${
      Number(videoOrder)! - 1
    }`;
  };
  return loading ? (
    <Loading />
  ) : (
    <>
      <div className="flex flex-col">
        <video className="md:h-[80vh] pt-10 pb-2 mx-auto" controls>
          <source src={video?.video} type="video/mp4" />
        </video>
        <h1 className="text-center text-xl">{video?.title}</h1>
        <div className="flex gap-10 w-full justify-center">
          <button
            onClick={handlePrev}
            disabled={Number(videoOrder) === 1}
            hidden={Number(videoOrder) === 1}
            className="_fill-btn-black"
          >
            Previous
          </button>
          <button onClick={handleNext} className="_fill-btn-black">
            Next
          </button>
        </div>
      </div>
    </>
  );
};

export default CourseVideo;
