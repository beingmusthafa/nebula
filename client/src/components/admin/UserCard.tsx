import React from "react";
import { Link } from "react-router-dom";

interface Props {
  user: {
    _id: string;
    name: string;
    email: string;
    image: string;
  };
}
const UserCard: React.FC<Props> = ({ user }) => {
  return (
    <Link
      to={`/admin/users/user-details/${user._id}`}
      className="flex flex-col items-center mt-2"
    >
      <img
        src={user.image}
        className="w-20 h-20 rounded-full"
        alt="user image"
      />
      <p className="mt-2 text-base">{user.name}</p>
      <p className="text-gray-500 mt-1">{user.email}</p>
    </Link>
  );
};

export default UserCard;
