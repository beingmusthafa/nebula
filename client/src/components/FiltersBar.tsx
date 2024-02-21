import React, { useRef, useState, useEffect, SetStateAction } from "react";
import { toast } from "react-toastify";
import languages from "../data/languages";
import { useNavigate } from "react-router-dom";

interface Props {
  page: number;
  search: string;
  filters: {
    minPrice: number;
    maxPrice: number;
    category: string;
    language: string;
    sort: string;
  };
}

const FiltersBar: React.FC<Props> = ({ page, search, filters }) => {
  console.log("child");
  console.log({ filters });
  let [categories, setCategories] = useState<{ name: string; image: string }[]>(
    []
  );
  let [showPriceInput, setShowPriceInput] = React.useState(false);
  let [minPrice, setMinPrice] = useState<number>(filters.minPrice);
  let [maxPrice, setMaxPrice] = useState<number>(filters.maxPrice);
  console.log({ minPrice, maxPrice });
  let minInputRef = useRef<HTMLInputElement | null>(null);
  let maxInputRef = useRef<HTMLInputElement | null>(null);
  let categoryInputRef = useRef<HTMLSelectElement | null>(null);
  let languageInputRef = useRef<HTMLSelectElement | null>(null);
  let sortInputRef = useRef<HTMLSelectElement | null>(null);
  const navigate = useNavigate();
  const handlePriceChange = () => {
    if (minInputRef.current && maxInputRef.current) {
      setMinPrice(
        Number(minInputRef.current.value) >= 0
          ? Number(minInputRef.current.value)
          : 0
      );
      setMaxPrice(
        Number(maxInputRef.current.value) <= 99999
          ? Number(maxInputRef.current.value)
          : 99999
      );
      setShowPriceInput(false);
    }
  };
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/get-categories").then((res) => res.json());
      if (!res.success) return toast.error(res.message);
      setCategories(res.categories);
    } catch (error) {
      toast.error("Something went wrong");
    }
  };
  useEffect(() => {
    fetchCategories();
  }, []);
  const applyFilters = () => {
    navigate(
      `/courses?page=${1}&search=${search}&minPrice=${minPrice}&maxPrice=${maxPrice}&category=${
        categoryInputRef.current?.value
      }&language=${languageInputRef.current?.value}&sort=${
        sortInputRef.current?.value
      }`
    );
  };
  const clearFilters = () => {
    navigate(`/courses?page=${1}&search=${search}`);
  };
  return (
    <div
      className="flex justify-between  h-12 sticky top-14 mb-4 border-b-black font-semibold bg-white  border-b-2 "
      style={{ zIndex: 9 }}
    >
      <div className="flex items-center w-fit justify-center p-4">
        <i className="bx bx-filter text-3xl"></i>
      </div>
      <div className="flex items-center whitespace-nowrap w-full gap-8 px-6 overflow-x-scroll  _no-scrollbar ">
        {showPriceInput && (
          <div className="absolute border-2 border-black border-t-0 justify-evenly bg-black flex items-center mr-auto top-12 w-full left-0 md:w-fit md:left-6 p-2 gap-2 font-normal">
            <p className="text-white">Price</p>
            <input
              defaultValue={minPrice}
              ref={minInputRef}
              type="number"
              placeholder="Min price"
              className="border w-24 border-black pl-4"
            />
            <i className="bx bx-right-arrow-alt text-xl text-white"></i>
            <input
              defaultValue={maxPrice}
              ref={maxInputRef}
              type="number"
              placeholder="Max price"
              className="border w-24 border-black pl-4"
            />
            <button
              onClick={handlePriceChange}
              className="bg-black text-white p-1"
            >
              Done
            </button>
          </div>
        )}

        <button onClick={() => setShowPriceInput(!showPriceInput)}>
          Set price
        </button>

        <select
          ref={categoryInputRef}
          className="border h-fit p-1 rounded-full border-black"
        >
          {filters.category ? (
            <option value="">All categories</option>
          ) : (
            <option selected value="">
              All categories
            </option>
          )}
          {categories.map((category) =>
            category.name === filters.category ? (
              <option selected value={category.name} key={category.name}>
                {category.name}
              </option>
            ) : (
              <option value={category.name} key={category.name}>
                {category.name}
              </option>
            )
          )}
        </select>

        <select
          ref={languageInputRef}
          className="border h-fit p-1 rounded-full border-black"
        >
          {filters.language ? (
            <option value="">All languages</option>
          ) : (
            <option selected value="">
              All languages
            </option>
          )}
          {languages.map((lang) =>
            lang === filters.language ? (
              <option selected value={lang} key={lang}>
                {lang}
              </option>
            ) : (
              <option value={lang} key={lang}>
                {lang}
              </option>
            )
          )}
        </select>

        <select
          ref={sortInputRef}
          className="border h-fit p-1 rounded-full border-black"
        >
          {filters.sort ? (
            <option disabled value="">
              Select sort
            </option>
          ) : (
            <option selected value="">
              Select sort
            </option>
          )}
          {filters.sort === "rating" ? (
            <option selected value="rating">
              Rating
            </option>
          ) : (
            <option value="rating">Rating</option>
          )}
          {filters.sort === "newest" ? (
            <option selected value="newest">
              Newest
            </option>
          ) : (
            <option value="newest">Newest</option>
          )}
          {filters.sort === "price_low" ? (
            <option value="price_low">Price: low to high</option>
          ) : (
            <option value="price_low">Price: low to high</option>
          )}
          {filters.sort === "price_high" ? (
            <option selected value="price_high">
              Price: high to low
            </option>
          ) : (
            <option value="price_high">Price: high to low</option>
          )}
        </select>
      </div>
      <div className="flex items-center w-fit justify-center">
        <button onClick={clearFilters} className="_fill-btn-red ml-4">
          X
        </button>
        <button onClick={applyFilters} className="_fill-btn-blue m-4">
          Apply
        </button>
      </div>
    </div>
  );
};

export default FiltersBar;
