import React, { useState } from "react";
import Loading from "../../components/Loading";
import { useNavigate, useParams } from "react-router-dom";

const ChapterInitialRedirect = () => {
  const { courseId, chapterId } = useParams();
  const navigate = useNavigate();
  const handleRedirect = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          `/api/get-chapter-redirect-info/${courseId}/${chapterId}`,
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      console.log({ res });
      if (!res.success) throw new Error(res.message);
      if (!res.nextResource) {
        return (location.href = `/my-courses/learn/${courseId}/completed`);
      }
      location.href = `/my-courses/learn/${courseId}/${chapterId}/${res.nextResource}/1`;
    } catch (error) {
      console.log(error);
    }
  };
  handleRedirect();
  return <Loading />;
};

export default ChapterInitialRedirect;
