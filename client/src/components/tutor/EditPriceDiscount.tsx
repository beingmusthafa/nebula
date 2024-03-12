import React, { SetStateAction, useRef, useState } from "react";
import Loading from "../Loading";
import ICourse from "../../interfaces/courses.interface";

interface Props {
  course: ICourse;
  setShow: React.Dispatch<SetStateAction<boolean>>;
  fetchData: () => void;
}
const EditPriceDiscount: React.FC<Props> = ({ course, setShow, fetchData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  let priceRef = useRef<HTMLInputElement>(null);
  let discountRef = useRef<HTMLInputElement>(null);
  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    const price = Number(priceRef.current?.value);
    const discount = Number(discountRef.current?.value);
    try {
      if (price - discount < 399) {
        throw new Error("Price including discount must be greater than 399");
      }
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          "/api/tutor/edit-price-discount/" +
          course._id,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            price,
            discount,
          }),
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      fetchData();
      setShow(false);
      setLoading(false);
    } catch (error: any) {
      setLoading(false);
      setError(error.message);
      console.log(error);
    }
  };
  return loading ? (
    <Loading />
  ) : (
    <div className="flex w-full justify-center">
      <form
        className="_screen-center flex flex-col bg-white border-4 _border-blue-black-gradient p-6 min-w-72"
        style={{ zIndex: 15 }}
        onSubmit={handleEdit}
      >
        <h1 className="_font-dm-display text-center text-lg">Edit pricing</h1>
        {error && <p className="text-red-500 font-semibold my-4">{error}</p>}
        <label className="font-semibold mt-4" htmlFor="">
          Price
        </label>
        <input
          defaultValue={course.price}
          className="border border-black p-2"
          ref={priceRef}
          type="text"
          placeholder="Price"
        />
        <label className="font-semibold mt-4" htmlFor="">
          Discount
        </label>
        <input
          defaultValue={course.discount}
          className="border border-black p-2"
          ref={discountRef}
          type="text"
          placeholder="Discount"
        />
        <div className="flex w-full justify-evenly mt-4">
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

export default EditPriceDiscount;
