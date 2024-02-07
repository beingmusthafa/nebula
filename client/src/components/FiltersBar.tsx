import React, { useRef, useState } from "react";

const FiltersBar = () => {
  const query = new URLSearchParams(window.location.search);
  let [showPriceInput, setShowPriceInput] = React.useState(false);
  let [minPrice, setMinPrice] = useState<number>(
    Number(query.get("minP")) || 0
  );
  let [maxPrice, setMaxPrice] = useState<number>(
    Number(query.get("maxP")) || 99999
  );
  console.log({ minPrice, maxPrice });
  let minInputRef = useRef<HTMLInputElement | null>(null);
  let maxInputRef = useRef<HTMLInputElement | null>(null);
  const handlePriceChange = () => {
    if (minInputRef.current && maxInputRef.current) {
      setMinPrice(Number(minInputRef.current.value));
      setMaxPrice(Number(maxInputRef.current.value));
      setShowPriceInput(false);
    }
  };
  return (
    <div className="flex justify-between  h-12 sticky top-14 mb-4 border-b-black font-semibold bg-white  border-b-2 ">
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
        <select className="border-2 h-fit p-1 rounded-full border-slate-400">
          <option selected value="">
            Category
          </option>
          <option value="">Technology</option>
          <option value="">Music</option>
        </select>
        <select className="border-2 h-fit p-1 rounded-full border-slate-400">
          <option selected value="">
            Sort
          </option>
          <option value="">Rating</option>
          <option value="">Newest</option>
          <option value="">Price: low to high</option>
          <option value="">Price: high to low</option>
        </select>
      </div>
      <div className="flex items-center w-fit justify-center">
        <button className="_fill-btn-blue m-4">Apply</button>
      </div>
    </div>
  );
};

export default FiltersBar;
