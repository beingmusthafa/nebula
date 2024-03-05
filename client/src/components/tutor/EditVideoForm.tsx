import React, { useState, useEffect, useRef } from "react";
import { toast } from "react-toastify";
import Loading from "../Loading";
interface Chapter {
  _id: string;
  order: number;
  title: string;
}
interface Video {
  _id: string;
  video: string;
  order: number;
  title: string;
  duration: number;
  chapter: string;
  course: string;
}
interface Props {
  data: Video;
  course: string;
  chapter: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const VideoEditForm: React.FC<Props> = ({ data, course, chapter, setShow }) => {
  let [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  let [video, setVideo] = useState<File | null>(null);
  let [orders, setOrders] = useState<number[]>([]);
  let titleRef = useRef<HTMLInputElement>(null);
  let orderRef = useRef<HTMLSelectElement>(null);
  const getData = async () => {
    setLoading(true);
    const res = await fetch("/api/tutor/get-videos-count/" + chapter).then(
      (res) => res.json()
    );
    if (!res.success) return toast.error(res.message);
    let arr = [];
    for (let i = 1; i <= res.count; i++) {
      arr.push(i);
    }
    setOrders(arr);
    setLoading(false);
  };
  useEffect(() => {
    try {
      getData();
    } catch (error) {
      console.log(error);
    }
  }, []);
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (!titleRef.current?.value) {
        return setError("All fields are required");
      } else setError("");
      const toastId = toast.loading("Editing video...");
      const formData = new FormData();
      formData.append("video", video!);
      formData.append("title", titleRef.current?.value!);
      if (orderRef.current?.value)
        formData.append("order", orderRef.current?.value);
      const res = await fetch("/api/tutor/edit-video/" + data._id, {
        method: "PUT",
        body: formData,
      }).then((res) => res.json());
      if (!res.success) {
        toast.dismiss(toastId);
        return setError(res.message);
      }
      toast.dismiss(toastId);
      toast.success("Video edited successfully");
      setShow(false);
      location.reload();
    } catch (error) {
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
        onSubmit={handleEdit}
      >
        <h1 className="_font-dm-display text-center text-lg">Edit video</h1>
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
        <label
          htmlFor="uploadVideo"
          className="_fill-btn-black w-fit mx-auto mb-10"
        >
          Choose video
        </label>
        <input
          className="border border-black p-2"
          ref={titleRef}
          defaultValue={data?.title}
          type="text"
          placeholder="Title"
        />
        <div>
          <label htmlFor="orderSelect" className="mr-6">
            Order:
          </label>
          <select
            ref={orderRef}
            name=""
            className="border border-black p-2"
            id="orderSelect"
          >
            {orders.map((order) => (
              <option
                value={order === data?.order ? "" : order}
                selected={order === data?.order}
              >
                {order}
              </option>
            ))}
          </select>
        </div>

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

export default VideoEditForm;
