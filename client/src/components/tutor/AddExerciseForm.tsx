import React, { useState, useRef, useEffect } from "react";
import { toast } from "react-toastify";
import Loading from "../Loading";

interface Chapter {
  _id: string;
  order: number;
  title: string;
}
interface Exercise {
  _id: string;
  order: number;
  title: string;
  chapter: string;
  course: string;
  question: string;
  options: string[];
  answer: string;
}
interface Props {
  course: string;
  chapter: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const AddExerciseForm: React.FC<Props> = ({ course, chapter, setShow }) => {
  let [chapters, setChapters] = useState<Chapter[]>([]);
  let [loading, setLoading] = useState(true);
  let [error, setError] = useState("");
  let questionRef = useRef<HTMLInputElement>(null);
  let optionARef = useRef<HTMLInputElement>(null);
  let optionBRef = useRef<HTMLInputElement>(null);
  let optionCRef = useRef<HTMLInputElement>(null);
  let optionDRef = useRef<HTMLInputElement>(null);
  let answerRef = useRef<HTMLSelectElement>(null);
  const getChapters = async () => {
    setLoading(true);
    const res = await fetch("/api/tutor/get-chapters/" + course).then((res) =>
      res.json()
    );
    setLoading(false);
    if (!res.success) return toast.error(res.message);
    setChapters(res.chapters);
  };
  useEffect(() => {
    try {
      getChapters();
    } catch (error) {
      console.log(error);
    }
  }, []);
  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (
        !(
          questionRef.current?.value.trim() &&
          optionARef.current?.value.trim() &&
          optionBRef.current?.value.trim() &&
          optionCRef.current?.value.trim() &&
          optionDRef.current?.value.trim() &&
          answerRef.current?.value
        )
      ) {
        return setError("All fields are required");
      } else setError("");
      const toastId = toast.loading("Adding exercise...");
      const res = await fetch("/api/tutor/add-exercise", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          chapter,
          course: course,
          question: questionRef.current?.value,
          options: [
            optionARef.current?.value,
            optionBRef.current?.value,
            optionCRef.current?.value,
            optionDRef.current?.value,
          ],
          answer: answerRef.current?.value,
        }),
      }).then((res) => res.json());
      if (!res.success) return toast.error(res.message);
      toast.dismiss(toastId);
      toast.success("Exercise added successfully");
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
        className="_screen-center _no-scrollbar bg-white border-4 _border-blue-black-gradient gap-4 p-8 min-w-72"
        style={{ zIndex: 15 }}
        onSubmit={handleAdd}
      >
        <h1 className="_font-dm-display text-center text-lg">Add exercise</h1>
        {error && <p className="text-red-500 font-semibold my-4">{error}</p>}
        <input
          type="text"
          ref={questionRef}
          className="border border-black p-2"
          placeholder="Question"
        />
        <input
          type="text"
          ref={optionARef}
          className="border border-black p-2"
          placeholder="Option A"
        />
        <input
          type="text"
          ref={optionBRef}
          className="border border-black p-2"
          placeholder="Option B"
        />
        <input
          type="text"
          ref={optionCRef}
          className="border border-black p-2"
          placeholder="Option C"
        />
        <input
          type="text"
          ref={optionDRef}
          className="border border-black p-2"
          placeholder="Option D"
        />

        <select ref={answerRef} name="" id="">
          <option value="" disabled selected>
            Select answer
          </option>

          <option value="A">Option A</option>
          <option value="B">Option B</option>
          <option value="C">Option C</option>
          <option value="D">Option D</option>
        </select>
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

export default AddExerciseForm;
