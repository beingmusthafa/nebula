import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { updateDetails } from "../../redux/user/userSlice";

interface Category {
  _id: string;
  name: string;
}

const Interests = () => {
  const { currentUser } = useSelector((state: any) => state.user);
  console.log("mounted");
  let [categories, setCategories] = useState<Category[]>([]);
  let [interests, setInterests] = useState<Set<string>>(new Set());
  const dispatch = useDispatch();
  const navigate = useNavigate();
  console.log(interests);
  const getCategories = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/get-categories"
      ).then((res) => res.json());
      console.log({ res });
      if (!res.success) throw new Error(res.message);
      setCategories(res.categories);
      console.log({ categories });
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCategories();
  }, []);
  const addInterests = async () => {
    const toastId = toast.loading("Adding interests");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/add-interests",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ interests: Array.from(interests) }),
        }
      ).then((res) => res.json());
      if (!res.success) throw new Error(res.message);
      toast.dismiss(toastId);
      dispatch(updateDetails(res.user));
      navigate("/");
    } catch (error) {
      toast.dismiss(toastId);
      console.log(error);
    }
  };
  if (!currentUser || currentUser?.interests?.length > 0) {
    return <Navigate to="/" />;
  }
  return (
    <div className="fixed w-full h-full flex justify-center items-center">
      <div className="_screen-center mx-auto flex flex-wrap w-[80vw] md:w-[50vw] justify-center _no-scrollbar">
        <h1 className="_font-dm-display w-full text-2xl text-center mt-10">
          Select your interests
        </h1>
        <p className="w-full text-center mb-6 mt-4">(Atleast 3)</p>
        {categories.map((category) => (
          <div
            key={category._id}
            onClick={() => {
              if (interests.has(category._id)) {
                const newSet = new Set(interests);
                newSet.delete(category._id);
                setInterests(newSet);
              } else {
                const newSet = new Set(interests);
                newSet.add(category._id);
                setInterests(newSet);
              }
            }}
            className={`cursor-pointer h-8 rounded-full  w-fit p-4 m-2 font-bold text-lg flex items-center border-2 border-sky-500 transition-colors ${
              interests.has(category._id) ? "bg-sky-500 text-white" : ""
            }`}
          >
            {category.name}
          </div>
        ))}
        <div className="flex justify-center gap-4 w-full my-10">
          <button
            onClick={addInterests}
            disabled={interests.size < 3}
            className={
              interests.size < 3
                ? "px-2 py-1 font-semibold bg-slate-400 cursor-not-allowed text-white"
                : "_fill-btn-black"
            }
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default Interests;
