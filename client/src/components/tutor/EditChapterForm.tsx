import React, { useRef, useState, useEffect } from "react";
import { toast } from "react-toastify";
import IChapter from "../../interfaces/chapters.interface";

interface Props {
  course: string;
  data: IChapter;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const EditChapterForm: React.FC<Props> = ({ course, data, setShow }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<number[]>([]);
  const titleRef = useRef<HTMLInputElement>(null);
  const orderRef = useRef<HTMLSelectElement>(null);
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    const title = titleRef.current?.value;
    if (!title?.trim()) return setError("Title is required!");
    if (title.length > 100) {
      setError("Title must be at most 100 characters");
      return;
    }
    const toastId = toast.loading("Editing chapter");
    const res = await fetch(
      import.meta.env.VITE_API_BASE_URL + "/api/tutor/edit-chapter/" + data._id,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        body: JSON.stringify({ title, order: orderRef.current?.value || "" }),
      }
    ).then((res) => res.json());
    toast.dismiss(toastId);
    if (!res.success) {
      setError(res.message);
      return;
    }
    toast.success(res.message);
    setShow(false);
    location.reload();
  };
  const getData = async () => {
    const res = await fetch(
      import.meta.env.VITE_API_BASE_URL +
        "/api/tutor/get-chapters-count/" +
        course,
      {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      }
    ).then((res) => res.json());
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
  return (
    <div className="flex w-full justify-center">
      <form
        className="_screen-center flex flex-col _no-scrollbar bg-white border-4 _border-blue-black-gradient gap-4 p-8 min-w-72"
        style={{ zIndex: 15 }}
        onSubmit={handleEdit}
      >
        <h1 className="_font-dm-display text-center text-lg">Edit chapter</h1>
        {error && <p className="text-red-500 font-semibold my-4">{error}</p>}
        <input
          type="text"
          defaultValue={data.title}
          ref={titleRef}
          className="border border-black p-2"
          placeholder="Title"
        />
        <div>
          <label htmlFor="orderSelect" className="mr-6">
            Order:
          </label>
          <select
            ref={orderRef}
            name=""
            id="orderSelect"
            className="border border-black p-2"
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

export default EditChapterForm;
