import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../components/Loading";
import IVideo from "../../interfaces/videos.interface";

interface NextData {
  nextVideo: boolean;
  nextExercise: boolean;
  nextChapter: boolean;
}
const CourseVideo = () => {
  const { courseId, chapterId, videoOrder } = useParams();
  const [video, setVideo] = useState<IVideo | null>(null);
  const [nextData, setNextData] = useState<NextData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const getData = async () => {
    try {
      setLoading(true);
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          `/api/get-course-video/${courseId}/${chapterId}/${videoOrder}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
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
      location.href = `/my-courses/learn/${courseId}/${nextData.nextChapter}`;
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
        <video
          className="md:h-[80vh] pb-2 mx-auto border-b-4 border-sky-500"
          controls
        >
          <source src={video?.video} type="video/mp4" />
        </video>
        <h1 className="text-center text-xl mt-4">{video?.title}</h1>
        <div className="flex gap-10 w-full justify-center mt-4">
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
