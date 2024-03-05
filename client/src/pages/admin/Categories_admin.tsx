import React, { useEffect, useState } from "react";
import CategoryCard from "../../components/admin/CategoryCard";
import CategoryForm from "../../components/admin/CategoryForm";
import { toast } from "react-toastify";
import AdminLoading from "../../components/admin/AdminLoading";

interface Category {
  _id: string;
  name: string;
  image: string;
}
const Categories_admin = () => {
  let [showAddForm, setShowAddForm] = useState(false);
  let [showDelete, setShowDelete] = useState(false);
  let [showEditForm, setShowEditForm] = useState(false);
  let [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  let [categories, setCategories] = useState<Category[] | null>([]);
  let [targetCategory, setTargetCategory] = useState("");
  let [loading, setLoading] = useState(true);
  const fetchCategories = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/get-categories").then((res) =>
      res.json()
    );
    setLoading(false);
    console.log(res);
    if (!res.success) return toast.error(res.message);
    setCategories(res.categories);
  };
  console.log("helo");
  useEffect(() => {
    fetchCategories();
  }, []);
  const handleDelete = async () => {
    if (!targetCategory) return toast.error("Please select a category");
    try {
      const res = await fetch(
        `/api/admin/delete-category/${selectedCategory?._id}/move/${targetCategory}`,
        {
          method: "DELETE",
        }
      ).then((res) => res.json());
      if (!res.success) return toast.error(res.message);
      toast.success(res.message);
      setTargetCategory("");
      setShowDelete(false);
      fetchCategories();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <>
      <div className="flex justify-between border-b py-2 mb-6">
        <p className="_font-dm-display text-xl">Categories</p>
        <button
          onClick={() => setShowAddForm(true)}
          className="_fill-btn-blue flex items-center"
        >
          Add
        </button>
      </div>
      {showDelete && (
        <div className="flex fixed w-full justify-center _admin-center">
          <div className="flex flex-col p-6 fixed top-1/3 border-2 border-black bg-white">
            <div className="text-base font-medium">
              Are you sure you want to delete {selectedCategory?.name}?
            </div>
            <label htmlFor="moveTo" className="mt-6 mb-2 font-semibold">
              Move items to:
            </label>
            <select
              name="moveto"
              id="moveTo"
              onChange={(e) => setTargetCategory(e.target.value)}
              className="_fill-btn-black"
            >
              <option selected value="">
                Select a category
              </option>
              {categories?.map((category, i) =>
                selectedCategory?._id !== category._id ? (
                  <option key={i} value={category._id}>
                    {category.name}
                  </option>
                ) : (
                  ""
                )
              )}
            </select>
            <div className="flex gap-10 mx-auto mt-4">
              <button
                onClick={() => setShowDelete(false)}
                className="_fill-btn-black"
              >
                Cancel
              </button>
              <button onClick={handleDelete} className="_fill-btn-red">
                Yes
              </button>
            </div>
          </div>
        </div>
      )}
      {showAddForm && (
        <CategoryForm
          onComplete={fetchCategories}
          formType="Add"
          setOpen={setShowAddForm}
        />
      )}
      {showEditForm && (
        <CategoryForm
          formType="Edit"
          onComplete={fetchCategories}
          setOpen={setShowEditForm}
          oldImage={selectedCategory?.image}
          oldName={selectedCategory?.name}
          id={selectedCategory?._id}
        />
      )}
      {}
      <div className="h-full w-full flex justify-evenly  flex-wrap">
        {loading ? (
          <AdminLoading />
        ) : (
          categories?.map((category, i) => (
            <CategoryCard
              key={i}
              category={category}
              setSelected={
                setSelectedCategory as React.Dispatch<
                  React.SetStateAction<Category>
                >
              }
              onDelete={() => setShowDelete(true)}
              onEdit={() => setShowEditForm(true)}
            />
          ))
        )}
      </div>
    </>
  );
};

export default Categories_admin;
