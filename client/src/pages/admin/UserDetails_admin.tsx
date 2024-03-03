import React, { useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { useEffect } from "react";
import { AuthErrorCodes } from "firebase/auth";
import MiniLoading from "../../components/MiniLoading";
import AdminLoading from "../../components/admin/AdminLoading";

interface User {
  name: string;
  email: string;
  image: string;
  bio: string;
  isBlocked: boolean;
}
const UserDetails_admin: React.FC = () => {
  const { id } = useParams();
  let [user, setUser] = useState<User | null>(null);
  let [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  async function changeBlockStatus(blockStatus: boolean) {
    console.log("blockStatus", blockStatus);
    const res = await fetch("/api/admin/change-block-status", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: user?.email,
        blockStatus,
      }),
    }).then((res) => res.json());
    if (res.statusCode === 401) return navigate("/sign-in");
    if (!res.success) return console.log(res.message);
    console.log(res.message);
    const newUserData = { ...user, isBlocked: blockStatus };
    setUser(newUserData as User);
  }
  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(`/api/admin/get-user/${id}`).then((res) =>
        res.json()
      );
      if (!res.success) return console.log(res.message);
      setUser(res.user);
      setLoading(false);
    };
    getUser();
    return () => {
      setUser(null);
    };
  }, [id]);
  return (
    <>
      {loading ? (
        <AdminLoading />
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center gap-10 justify-center w-full p-10">
            <div className="flex flex-col items-start gap-4 order-2 md:order-1">
              <div>
                <p className="text-black font-bold">Name</p>
                <p className="font-medium text-base text-slate-600">
                  {user?.name}
                </p>
              </div>
              <div>
                <p className="text-black font-bold">Email</p>
                <p className="font-medium text-base text-slate-600">
                  {user?.email}
                </p>
              </div>

              <div>
                <p className="text-black font-bold">Bio</p>
                <p className="font-medium text-base text-slate-600 w-80">
                  {user?.bio || "No bio provided"}
                </p>
              </div>
            </div>
            <img
              className="w-36 h-36 rounded-full order-1 md:order-2 md:mb-auto"
              src={user?.image}
              alt=""
            />
          </div>
          <div className="flex justify-center gap-6">
            {user?.isBlocked ? (
              <button
                onClick={() => changeBlockStatus(false)}
                className=" _fill-btn-green text-white  py-2 px-4 font-semibold"
              >
                Unblock
              </button>
            ) : (
              <button
                onClick={() => changeBlockStatus(true)}
                className=" _fill-btn-red text-white  py-2 px-4 font-semibold"
              >
                Block
              </button>
            )}
            <button className="_fill-btn-blue text-white py-2 px-4 font-semibold">
              Notify
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default UserDetails_admin;
