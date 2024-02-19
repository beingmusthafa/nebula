import React from "react";

interface Props {
  data: {
    image: string;
    isActive: boolean;
    link: string;
  };
  onEdit: () => void;
  onDelete: () => void;
  onEnable: () => void;
  onDisable: () => void;
}
const BannerTableRow: React.FC<Props> = ({
  onEdit,
  onDelete,
  onEnable,
  onDisable,
  data,
}) => {
  return (
    <tr>
      <td className="w-48">
        <img className="h-16 w-48 object-cover" src={data.image} alt="" />
      </td>
      <td className="text-center">
        {data.isActive ? (
          <i
            onClick={onDisable}
            className="bx bxs-toggle-right text-5xl text-green-500 cursor-pointer"
          ></i>
        ) : (
          <i
            onClick={onEnable}
            className="bx bx-toggle-left text-5xl text-slate-400 cursor-pointer"
          ></i>
        )}
      </td>
      <td className="text-center">
        <p className="font-semibold w-fit mx-auto max-w-32 md:max-w-64 overflow-hidden whitespace-nowrap text-ellipsis">
          {data.link}
        </p>
      </td>
      <td className="text-center">
        <div className="flex items-center justify-center gap-4">
          <button onClick={onEdit}>
            <i className="bx bxs-edit text-2xl text-blue-500 cursor-pointer"></i>
          </button>
          <button onClick={onDelete}>
            <i className="bx bxs-trash text-2xl text-red-500 cursor-pointer"></i>
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BannerTableRow;
