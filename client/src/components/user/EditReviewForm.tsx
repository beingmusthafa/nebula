import React, { useRef, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  review: {
    _id: string;
    user: {
      _id: string;
      name: string;
      image: string;
    };
    rating: number;
    comment: string;
  };
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  getReviews: () => void;
}
const EditReviewForm: React.FC<Props> = ({ review, setShow, getReviews }) => {
  let [error, setError] = useState("");
  let [rating, setRating] = useState(review.rating);
  let commentRef = useRef<HTMLTextAreaElement>(null);
  const handleEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    const toastId = toast.loading("Editing review");
    try {
      if (
        commentRef.current?.value.trim() &&
        commentRef.current?.value.length! > 500
      ) {
        toast.dismiss(toastId);
        return setError("Comment must be less than 500 characters");
      }
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/edit-review/" + review._id,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            rating,
            comment: commentRef.current?.value.trim(),
          }),
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      toast.dismiss(toastId);
      toast.success("Review edited successfully");
      location.reload();
    } catch (error: any) {
      toast.dismiss(toastId);
      console.log(error);
      toast.error(error?.message || error);
    }
  };
  return (
    <div className="flex w-full justify-center">
      <form
        className="_screen-center flex flex-col bg-white border-4 _border-blue-black-gradient gap-4 p-6 min-w-72"
        style={{ zIndex: 15 }}
        onSubmit={handleEdit}
      >
        <h1 className="_font-dm-display text-center text-lg">Edt review</h1>
        {error && <p className="text-red-500 font-semibold my-4">{error}</p>}
        <div className="flex gap-2 mx-auto">
          <i
            onClick={() => setRating(1)}
            className="bx bxs-star text-yellow-400 text-3xl"
          ></i>
          <i
            onClick={() => setRating(2)}
            className={`bx text-3xl ${
              rating >= 2 ? "bxs-star text-yellow-400" : "bx-star"
            }`}
          ></i>
          <i
            onClick={() => setRating(3)}
            className={`bx text-3xl ${
              rating >= 3 ? "bxs-star text-yellow-400" : "bx-star"
            }`}
          ></i>
          <i
            onClick={() => setRating(4)}
            className={`bx text-3xl ${
              rating >= 4 ? "bxs-star text-yellow-400" : "bx-star"
            }`}
          ></i>
          <i
            onClick={() => setRating(5)}
            className={`bx text-3xl ${
              rating === 5 ? "bxs-star text-yellow-400" : "bx-star"
            }`}
          ></i>
        </div>
        <textarea
          defaultValue={review.comment}
          ref={commentRef}
          name=""
          id=""
          rows={10}
          className="border border-black p-2"
          placeholder="Write your comment here (optional)"
        ></textarea>
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

export default EditReviewForm;
