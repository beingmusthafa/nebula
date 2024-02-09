import React from "react";

interface Category {
  _id: string;
  name: string;
  image: string;
}
interface Props {
  setSelected: React.Dispatch<React.SetStateAction<Category>>;
  category: {
    _id: string;
    name: string;
    image: string;
  };
  onDelete: () => void;
  onEdit: () => void;
}
const CategoryCard: React.FC<Props> = ({
  setSelected,
  category,
  onDelete,
  onEdit,
}) => {
  return (
    <div className="flex flex-col items-center gap-2 border w-fit m-3 p-2">
      <img className="h-32 w-32 md:h-36 md:w-36" src={category.image} alt="" />
      <p className="w-28 md:w-36 overflow-hidden text-center text-ellipsis text-base font-medium">
        {category.name}
      </p>
      <div className="flex justify-evenly w-full">
        <button
          onClick={() => {
            setSelected(category);
            onDelete();
          }}
        >
          <i className="bx bx-trash text-xl text-red-500"></i>
        </button>
        <button
          onClick={() => {
            setSelected(category);
            onEdit();
          }}
        >
          <i className="bx bx-edit text-xl"></i>
        </button>
      </div>
    </div>
  );
};

export default CategoryCard;
