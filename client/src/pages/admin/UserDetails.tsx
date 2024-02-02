import { useState } from "react";
import { useLocation } from "react-router-dom";
import AdminLayout from "../../components/admin/AdminLayout";
import { useEffect } from "react";
interface User {
  name: string;
  email: string;
  image: string;
  bio: string;
}
const UserDetails = () => {
  const url = new URLSearchParams(useLocation().search);
  const id = url.get("id");
  let [user, setUser] = useState<User | null>(null);
  useEffect(() => {
    const getUser = async () => {
      const res = await fetch(`/api/admin/get-user/${id}`).then((res) =>
        res.json()
      );
      if (!res.success) return console.log(res.message);
      setUser(res.user);
    };
    getUser();
    console.log(user);
    return () => {
      setUser(null);
    };
  }, [id]);
  return (
    <AdminLayout>
      <div className="flex flex-col md:flex-row items-center gap-10 justify-center w-full p-10">
        <div className="flex flex-col items-start gap-4 order-2 md:order-1">
          <div>
            <p className="text-black font-bold">Name</p>
            <p className="font-medium text-base text-slate-600">{user?.name}</p>
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
              {user?.bio}
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
        <button className=" _fill-btn-red text-white  py-2 px-4 font-semibold">
          Block
        </button>
        <button className="  _fill-btn-red text-white py-2 px-4 font-semibold">
          Delete
        </button>
        <button className="_fill-btn-blue text-white py-2 px-4 font-semibold">
          View courses
        </button>
      </div>
    </AdminLayout>
  );
};

export default UserDetails;
