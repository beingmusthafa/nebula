import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import UserCard from "../../components/admin/UserCard";
import Loading from "../../components/Loading";
import MiniLoading from "../../components/MiniLoading";
import AdminLoading from "../../components/admin/AdminLoading";
interface User {
  _id: string;
  name: string;
  email: string;
  image: string;
}
const Users_admin = () => {
  let [users, setUsers] = useState<User[]>([]);
  let [page, setPage] = useState<number>(1);
  let [hasNext, setHasNext] = useState<boolean>(true);
  let [loading, setLoading] = useState<boolean>(false);
  async function fetchUsers() {
    setLoading(true);
    const res = await fetch(
      import.meta.env.VITE_API_BASE_URL +
        `/api/admin/get-all-users?page=${page}`,
      {
        headers: {
          "Authorization": "Bearer " + localStorage.getItem("token"),
        },
      }
    ).then((res) => res.json());
    setLoading(false);
    if (!res.success) return console.log(res.message);
    setUsers([...users, ...res.result.docs]);
    setHasNext(res.result.hasNextPage);
  }
  useEffect(() => {
    fetchUsers();
  }, [page]);
  return (
    <>
      {/* <form
        action=""
        className="md:flex w-fit mx-auto justify-center border border-black py-1 px-4 mb-10 rounded-full sticky  bg-white hidden"
      >
        <input
          type="text"
          placeholder="Search for users"
          className=" pl-4 w-44 md:w-80 border-0"
        />
        <button className="ml-2">
          <i className="bx bx-search-alt-2 text-lg"></i>
        </button>
      </form> */}
      {loading ? (
        <AdminLoading />
      ) : (
        <div className="flex justify-start gap-8  flex-wrap">
          {users.map((user, i) => (
            <UserCard user={user} key={i} />
          ))}
          {users.length > 0 && hasNext && (
            <div className="w-24 h-24 flex items-center justify-center">
              <button
                onClick={() => setPage(page + 1)}
                className="font-semibold p-2 rounded-full h-fit  bg-slate-400 text-white"
              >
                See more
              </button>
            </div>
          )}
        </div>
      )}
    </>
  );
};

export default Users_admin;
