import React from "react";

const UserCard = ({ user }) => {
  return (
    <div className="flex flex-col items-center mt-2">
      <img
        src={user.image}
        className="w-20 h-20 rounded-full"
        alt="user image"
      />
      <p className="mt-2 text-base">{user.name}</p>
      <p className="text-gray-500 mt-1">{user.email}</p>
    </div>
  );
};

export default UserCard;
