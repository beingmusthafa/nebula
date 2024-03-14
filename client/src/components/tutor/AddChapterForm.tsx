import React, { useRef, useState } from "react";
import { toast } from "react-toastify";
import Loading from "../Loading";

interface Props {
  course: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddChapterForm: React.FC<Props> = ({ course, setShow }) => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    const title = titleRef.current?.value;
    if (!title?.trim()) {
      setLoading(false);
      setError("Title is required!");
      return;
    }
    const toastId = toast.loading("Adding chapter");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/tutor/add-chapter",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({ title, course }),
        }
      ).then((res) => res.json());
      toast.dismiss(toastId);
      if (!res.success) {
        setError(res.message);
        setLoading(false);
        return;
      }
      setLoading(false);
      setShow(false);
      location.reload();
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  };

  return loading ? (
    <Loading />
  ) : (
    <div className="flex w-full justify-center">
      <form
        className="_screen-center flex flex-col _no-scrollbar bg-white border-4 _border-blue-black-gradient gap-4 p-8 min-w-72"
        style={{ zIndex: 15 }}
        onSubmit={handleAdd}
      >
        <h1 className="_font-dm-display text-center text-lg">Add chapter</h1>
        {error && <p className="text-red-500 font-semibold my-4">{error}</p>}
        <input
          type="text"
          ref={titleRef}
          className="border border-black p-2"
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

export default AddChapterForm;
