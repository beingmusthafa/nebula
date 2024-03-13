import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Loading from "../Loading";
import IChapter from "../../interfaces/chapters.interface";

interface Props {
  course: string;
  chapter: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const VideoForm: React.FC<Props> = ({ course, chapter, setShow }) => {
  const [chapters, setChapters] = useState<IChapter[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [video, setVideo] = useState<File | null>(null);
  let titleRef = useRef<HTMLInputElement>(null);
  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      import.meta.env.VITE_API_BASE_URL + "/api/tutor/get-chapters/" + course,
      {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      }
    ).then((res) => res.json());
    if (!res.success) return toast.error(res.message);
    setChapters(res.chapters);
    setLoading(false);
  };
  useEffect(() => {
    try {
      getData();
    } catch (error) {
      console.log(error);
    }
  }, []);
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const toastId = toast.loading("Adding video...");
    try {
      if (!(video && titleRef.current?.value)) {
        setLoading(false);
        toast.dismiss(toastId);
        return setError("All fields are required");
      } else setError("");
      const formData = new FormData();
      formData.append("video", video!);
      formData.append("title", titleRef.current?.value!);
      formData.append("chapter", chapter);
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/tutor/add-video",
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          method: "POST",
          body: formData,
        }
      ).then((res) => res.json());
      if (!res.success) return new Error(res.message);
      toast.dismiss(toastId);
      toast.success("Video added successfully");
      setShow(false);
      location.reload();
    } catch (error) {
      setLoading(false);
      toast.dismiss(toastId);
      toast.error(error as string);
      console.log(error);
    }
  };
  return loading ? (
    <Loading />
  ) : (
    <div className="flex w-full justify-center">
      <form
        className="_screen-center flex flex-col bg-white border-4 _border-blue-black-gradient gap-4 p-6 min-w-72"
        style={{ zIndex: 15 }}
        onSubmit={handleAdd}
      >
        <h1 className="_font-dm-display text-center text-lg">Add video</h1>
        {error && <p className="text-red-500 font-semibold my-4">{error}</p>}
        <input
          type="file"
          id="uploadVideo"
          className="w-32 font-semibold text-lg mx-auto mb-2 border border-black"
          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
            e.target.files && setVideo(e.target.files[0])
          }
          accept="video/*"
        />
        {/* {imageError && (
          <p className="font-semibold text-red-500 text-base mx-auto">
            {imageError}
          </p>
        )} */}
        <label
          htmlFor="uploadVideo"
          className="_fill-btn-black w-fit mx-auto mb-10"
        >
          Choose video
        </label>
        <input
          className="border border-black p-2"
          ref={titleRef}
          type="text"
          placeholder="Title"
        />
        <div className="flex w-full justify-evenly">
          <button
            type="button"
            onClick={() => setShow(false)}
            className="text-red-500 font-semibold"
          >
            Cancel
          </button>
          <button type="submit" className="_fill-btn-blue">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
};

export default VideoForm;
