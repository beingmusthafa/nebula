import React, { Dispatch, SetStateAction, useRef, useState } from "react";
import { toast } from "react-toastify";

interface Props {
  onComplete: () => void;
  setOpen: Dispatch<SetStateAction<boolean>>;
  formType: "Add" | "Edit";
  oldName?: string;
  oldImage?: string;
  id?: string;
}
const CategoryForm: React.FC<Props> = ({
  setOpen,
  formType,
  oldName,
  oldImage,
  id,
  onComplete,
}) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [error, setError] = useState<string>("");
  let nameRef = useRef<HTMLInputElement | null>(null);
  const onAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value;
    if (!name) return setError("Enter name!");
    if (name.trim().length < 3) return setError("Invalid name!");
    if (!imageFile) return setError("Choose an image!");
    try {
      const toastId = toast.loading("Adding Category");
      const body = new FormData();
      body.append("image", imageFile as File);
      body.append("name", name);
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/admin/create-category",
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          method: "POST",
          body,
        }
      ).then((res) => res.json());
      toast.dismiss(toastId);
      if (!res.success) return toast.error(res.message);
      toast.success("Category added successfully");
      onComplete();
      setOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  const onEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = nameRef.current?.value;
    if (name === oldName && !imageFile) return setError("No changes detected");
    if (!name) return setError("Enter name!");
    if (name.trim().length < 3) return setError("Invalid name!");
    if (!imageFile && !oldImage) return setError("Choose an image!");
    try {
      const toastId = toast.loading("Editing Category");
      const body = new FormData();
      body.append("image", imageFile as File);
      body.append("name", name);
      body.append("id", id!);
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/admin/edit-category",
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          method: "PUT",
          body,
        }
      ).then((res) => res.json());
      toast.dismiss(toastId);
      if (!res.success) return toast.error(res.message);
      toast.success("Category edited successfully");
      onComplete();
      setOpen(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  return (
    <div className="flex fixed top-40 items-center justify-center w-full _admin-center">
      <form
        action=""
        className="flex flex-col gap-5 p-5 px-10 w-fit _bg-light border-2 border-black"
        onSubmit={formType === "Add" ? onAddSubmit : onEditSubmit}
      >
        <h1 className="_font-dm-display mx-auto text-xl">
          {formType} category
        </h1>
        <p className="block text-center text-wrap font-semibold text-red-500">
          {error}
        </p>
        {imageFile ? (
          <img
            className="h-32 mx-auto"
            src={imageFile ? URL.createObjectURL(imageFile) : ""}
            alt=""
          />
        ) : oldImage ? (
          <img className="h-32 mx-auto" src={oldImage} alt="" />
        ) : (
          ""
        )}
        <input
          name="image"
          id="imageInput"
          type="file"
          onChange={(e) => {
            if (e.target.files) {
              setImageFile(e.target.files[0]);
            }
          }}
          className="border border-black hidden p-2"
          placeholder="Hello"
        />
        <label htmlFor="imageInput" className="_fill-btn-black text-center">
          Choose image
        </label>
        <input
          defaultValue={oldName || ""}
          ref={nameRef}
          type="text"
          className="border border-black p-2"
          placeholder="Category name"
        />
        <div className="flex justify-center gap-10">
          <button
            onClick={() => setOpen(false)}
            type="button"
            className="font-semibold text-red-500"
          >
            Cancel
          </button>
          <button className="_fill-btn-blue">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
