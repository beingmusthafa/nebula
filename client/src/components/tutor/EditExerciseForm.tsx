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
  data?: Exercise;
  course: string;
  chapter: string;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const ExerciseForm: React.FC<Props> = ({ data, course, chapter, setShow }) => {
  let [error, setError] = useState("");
  let [loading, setLoading] = useState(true);
  let [orders, setOrders] = useState<number[]>([]);
  let questionRef = useRef<HTMLInputElement>(null);
  let optionARef = useRef<HTMLInputElement>(null);
  let optionBRef = useRef<HTMLInputElement>(null);
  let optionCRef = useRef<HTMLInputElement>(null);
  let optionDRef = useRef<HTMLInputElement>(null);
  let answerRef = useRef<HTMLSelectElement>(null);
  let orderRef = useRef<HTMLSelectElement>(null);
  const getData = async () => {
    setLoading(true);
    const res = await fetch(
      import.meta.env.VITE_API_BASE_URL +
        "/api/tutor/get-exercises-count/" +
        chapter
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
  const handleEdit = async (e: React.FormEvent) => {
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
      const toastId = toast.loading("Editing exercise...");
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          "/api/tutor/edit-exercise/" +
          data?._id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            chapter: chapter,
            question: questionRef.current?.value,
            options: [
              optionARef.current?.value,
              optionBRef.current?.value,
              optionCRef.current?.value,
              optionDRef.current?.value,
            ],
            answer: answerRef.current?.value,
            order: orderRef.current?.value || "",
          }),
        }
      ).then((res) => res.json());
      if (!res.success) return setError(res.message);
      toast.dismiss(toastId);
      toast.success("Exercise edited successfully");
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
        className="_screen-center flex flex-col _no-scrollbar bg-white border-4 _border-blue-black-gradient gap-4 p-8 min-w-72"
        style={{ zIndex: 15 }}
        onSubmit={handleEdit}
      >
        <h1 className="_font-dm-display text-center text-lg">Edit exercise</h1>
        {error && <p className="text-red-500 font-semibold my-4">{error}</p>}
        <input
          defaultValue={data?.question}
          type="text"
          ref={questionRef}
          className="border border-black p-2"
          placeholder="Question"
        />
        <input
          defaultValue={data?.options[0]}
          type="text"
          ref={optionARef}
          className="border border-black p-2"
          placeholder="Option A"
        />
        <input
          defaultValue={data?.options[1]}
          type="text"
          ref={optionBRef}
          className="border border-black p-2"
          placeholder="Option B"
        />
        <input
          defaultValue={data?.options[2]}
          type="text"
          ref={optionCRef}
          className="border border-black p-2"
          placeholder="Option C"
        />
        <input
          defaultValue={data?.options[3]}
          type="text"
          ref={optionDRef}
          className="border border-black p-2"
          placeholder="Option D"
        />

        <div>
          <label htmlFor="answerSelect" className="mr-6">
            Answer:
          </label>
          <select
            className="border border-black p-2"
            ref={answerRef}
            name=""
            id="answerSelect"
          >
            {data?.answer === "A" ? (
              <option selected value="A">
                Option A
              </option>
            ) : (
              <option value="A">Option A</option>
            )}
            {data?.answer === "B" ? (
              <option selected value="B">
                Option B
              </option>
            ) : (
              <option value="B">Option B</option>
            )}
            {data?.answer === "C" ? (
              <option selected value="C">
                Option C
              </option>
            ) : (
              <option value="C">Option C</option>
            )}
            {data?.answer === "D" ? (
              <option selected value="D">
                Option D
              </option>
            ) : (
              <option value="D">Option D</option>
            )}
          </select>
        </div>
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

export default ExerciseForm;
