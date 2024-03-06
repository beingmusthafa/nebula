import React, { useEffect, useRef, useState } from "react";
import { Slide, ToastContainer, toast } from "react-toastify";
import uploadImage from "../../assets/image_upload.jpg";
import { useNavigate, useParams } from "react-router-dom";
import Loading from "../../components/Loading";
import languages from "../../data/languages";

const EditCourse = () => {
  const { id } = useParams();
  let [categories, setCategories] = useState<
    { name: string; _id: string; image: string }[]
  >([]);
  let [loading, setLoading] = useState(true);
  let [imageError, setImageError] = useState("");
  let [titleError, setTitleError] = useState("");
  let [descriptionError, setDescriptionError] = useState("");
  let [priceError, setPriceError] = useState("");
  let [discountError, setDiscountError] = useState("");
  let [languageError, setLanguageError] = useState("");
  let [categoryError, setCategoryError] = useState("");
  let [image, setImage] = useState<File | null>(null);
  let [imageUrl, setImageUrl] = useState("");
  let [title, setTitle] = useState<string>("");
  let [description, setDescription] = useState<string>("");
  let [category, setCategory] = useState<string>("");
  let [language, setLanguage] = useState<string>("");
  let [price, setPrice] = useState<number>(0);
  let [discount, setDiscount] = useState<number>(0);
  let [requirements, setRequirements] = useState<Set<string>>(new Set());
  let [benefits, setBenefits] = useState<Set<string>>(new Set());
  let reqInputRef = useRef<HTMLInputElement | null>(null);
  let benInputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();
  const getCategoryDetails = async () => {
    if (!loading) setLoading(true);
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          "/api/tutor/get-course-details/" +
          id,
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) return toast.error(res.message);
      setCategory(res.doc.category);
      setLanguage(res.doc.language);
      setPrice(res.doc.price);
      setDiscount(res.doc.discount);
      setRequirements(new Set(res.doc.requirements));
      setBenefits(new Set(res.doc.benefits));
      setTitle(res.doc.title);
      setDescription(res.doc.description);
      setImageUrl(res.doc.thumbnail);
      setImage(null);
      setLoading(false);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    getCategoryDetails();
  }, []);
  const fetchCategories = async () => {
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/tutor/get-categories",
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      if (!res.success) return toast.error(res.message);
      setCategories(res.categories);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  function addBenefit(ben: string | undefined) {
    console.log(ben);
    if (!ben || !ben.trim()) return;
    let newSet = new Set(benefits);
    newSet.add(ben.trim());
    setBenefits(newSet);
    if (benInputRef.current) benInputRef.current.value = "";
    benInputRef.current?.focus();
  }
  function removebenefit(ben: string) {
    let newSet = new Set(benefits);
    newSet.delete(ben);
    setBenefits(newSet);
  }
  function addRequirement(req: string | undefined) {
    if (!req || !req.trim()) return;
    let newSet = new Set(requirements);
    newSet.add(req.trim());
    setRequirements(newSet);
    if (reqInputRef.current) reqInputRef.current.value = "";
    reqInputRef.current?.focus();
  }
  function removeRequirement(req: string) {
    let newSet = new Set(requirements);
    newSet.delete(req);
    setRequirements(newSet);
  }
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!title.trim()) setTitleError("Enter a title");
    else setTitleError("");
    if (!description.trim()) setDescriptionError("Enter a description");
    else setDescriptionError("");
    if (!price) setPriceError("Enter a price");
    else setPriceError("");
    if (!discount) setDiscountError("Enter discount");
    else setDiscountError("");
    if (!language.trim()) setLanguageError("Enter a language");
    else setLanguageError("");
    if (!category) setCategoryError("Choose a category");
    else setCategoryError("");
    if (!(title && description && price && language && category)) {
      return;
    }
    const toastId = toast.loading("Editing course...");
    const formData = new FormData();
    formData.append("id", id as string);
    formData.append("thumbnail", image as File);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("category", category);
    formData.append("language", language);
    formData.append("price", price.toString());
    formData.append("discount", discount.toString());
    Array.from(requirements).forEach((req, i) => {
      formData.append(`requirements[${i}]`, req);
    });
    Array.from(benefits).forEach((ben, i) => {
      formData.append(`benefits[${i}]`, ben);
    });
    const res = await fetch(
      import.meta.env.VITE_API_BASE_URL + "/api/tutor/edit-course",
      {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
        method: "PUT",
        body: formData,
      }
    ).then((res) => res.json());
    toast.dismiss(toastId);
    if (!res.success) return toast.error(res.message);
    navigate(-1);
    toast.success("Edited course successfully");
  }
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="text-center _font-dm-display text-2xl m-4">
            Edit course
          </div>
          <div className="flex">
            <form
              onSubmit={handleSubmit}
              action=""
              className="flex flex-col mx-auto items-center p-4 text-base"
            >
              {/* <CropDemo src={image ? URL.createObjectURL(image) : ""} /> */}
              <img
                src={image ? URL.createObjectURL(image!) : imageUrl}
                className="w-40"
                alt=""
              />
              <input
                type="file"
                id="uploadThumbnail"
                className="w-32 font-semibold text-lg mx-auto mb-2"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  e.target.files && setImage(e.target.files[0])
                }
                style={{ background: uploadImage }}
                accept="image/*"
              />
              {imageError && (
                <p className="font-semibold text-red-500 text-base mx-auto">
                  {imageError}
                </p>
              )}
              <label
                htmlFor="uploadThumbnail"
                className="_fill-btn-black w-fit mx-auto mb-10"
              >
                Choose thumbnail
              </label>
              {titleError && (
                <p className="font-semibold text-red-500 text-base">
                  {titleError}
                </p>
              )}
              <input
                defaultValue={title}
                onChange={(e) => setTitle(e.target.value)}
                type="text"
                placeholder="Course title"
                className="w-96 border-2 border-black p-2 m-2"
              />
              {descriptionError && (
                <p className="font-semibold text-red-500 text-base">
                  {descriptionError}
                </p>
              )}
              <textarea
                defaultValue={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={5}
                placeholder="Course description"
                className="w-96 border-2 border-black  p-2 m-2"
              />
              {categoryError && (
                <p className="font-semibold text-red-500 text-base">
                  {categoryError}
                </p>
              )}
              <select
                onChange={(e) => setCategory(e.target.value)}
                className="w-52 border-2 border-black  p-2 m-2"
              >
                {categories?.map((cat, i) =>
                  category === cat._id ? (
                    <option selected key={i} value={cat._id}>
                      {cat.name}
                    </option>
                  ) : (
                    <option key={i} value={cat._id}>
                      {cat.name}
                    </option>
                  )
                )}
              </select>
              {priceError && (
                <p className="font-semibold text-red-500 text-base">
                  {priceError}
                </p>
              )}
              <input
                defaultValue={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                type="number"
                placeholder="Enrollment price"
                className="w-52 border-2 border-black  p-2 m-2"
              />
              {discountError && (
                <p className="font-semibold text-red-500 text-base">
                  {discountError}
                </p>
              )}
              <input
                defaultValue={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                type="number"
                placeholder="Price discount"
                className="w-52 border-2 border-black  p-2 m-2"
              />
              {languageError && (
                <p className="font-semibold text-red-500 text-base">
                  {languageError}
                </p>
              )}
              <select
                onChange={(e) => setLanguage(e.target.value)}
                className="w-52 border-2 border-black  p-2 m-2"
                name=""
                id=""
              >
                {languages.map((lang, i) =>
                  language === lang ? (
                    <option selected key={i} value={lang}>
                      {lang}
                    </option>
                  ) : (
                    <option key={i} value={lang}>
                      {lang}
                    </option>
                  )
                )}
              </select>
              <label htmlFor="" className="font-bold my-2">
                Benefits : what do learners achieve? (optional)
              </label>
              {benefits.size > 0 ? (
                Array.from(benefits).map((ben, i) => (
                  <div key={i} className="flex items-center">
                    <button
                      onClick={() => removebenefit(ben)}
                      type="button"
                      className="text-red-600 text-2xl mr-2 font-bold"
                    >
                      -
                    </button>
                    <p className="font-semibold text-slate-600">{ben}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No benefits added</p>
              )}
              <div className="flex">
                <input
                  ref={benInputRef}
                  type="text"
                  placeholder="Enter benefit"
                  className="w-52 border-2 border-black  p-2 m-2"
                />
                <button
                  onClick={() => addBenefit(benInputRef.current?.value)}
                  type="button"
                  className="font-semibold text-blue-400"
                >
                  Add
                </button>
              </div>
              <label htmlFor="" className="font-bold my-2">
                Requirements (optional)
              </label>
              {requirements.size > 0 ? (
                Array.from(requirements).map((req, i) => (
                  <div key={i} className="flex items-center">
                    <button
                      onClick={() => removeRequirement(req)}
                      type="button"
                      className="text-red-600 text-2xl mr-2 font-bold"
                    >
                      -
                    </button>
                    <p className="font-semibold text-slate-600">{req}</p>
                  </div>
                ))
              ) : (
                <p className="text-slate-500">No requirements added</p>
              )}
              <div className="flex">
                <input
                  ref={reqInputRef}
                  type="text"
                  placeholder="Enter requirement"
                  className="w-52 border-2 border-black  p-2 m-2"
                />
                <button
                  onClick={() => addRequirement(reqInputRef.current?.value)}
                  type="button"
                  className="font-semibold text-blue-400"
                >
                  Add
                </button>
              </div>
              <div className="flex justify-end gap-8 mt-10">
                <button
                  type="button"
                  className="font-semibold text-red-500"
                  onClick={() => navigate(-1)}
                >
                  Cancel
                </button>
                <button type="submit" className="_fill-btn-green">
                  Edit
                </button>
              </div>
            </form>
          </div>
        </>
      )}
    </>
  );
};

export default EditCourse;
