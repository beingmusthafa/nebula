import React, { useEffect, useState } from "react";
import AdminLayout from "../../components/admin/AdminLayout";
import UserCard from "../../components/admin/UserCard";
import Loading from "../../components/Loading";

const Users = () => {
  let [users, setUsers] = useState([]);
  let [page, setPage] = useState(1);
  let [hasNext, setHasNext] = useState(true);
  let [loading, setLoading] = useState(false);
  async function fetchUsers() {
    setLoading(true);
    const res = await fetch(`/api/admin/get-all-users?page=${page}`).then(
      (res) => res.json()
    );
    console.log(res.message);
    setLoading(false);
    if (!res.success) return console.log(res.message);
    setUsers([...users, ...res.result.docs]);
    setHasNext(res.result.hasNextPage);
  }
  useEffect(() => {
    fetchUsers();
    console.log("run");
  }, [page]);
  return (
    <AdminLayout>
      <form action="" className="flex justify-center w-full mb-10">
        <input
          type="text"
          placeholder="Search users..."
          className="p-1 text-base border border-black pl-4 w-80"
        />
        <button className="_fill-btn-black">
          <i class="bx bx-search-alt-2 text-lg"></i>
        </button>
      </form>
      {loading ? (
        <Loading />
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
    </AdminLayout>
  );
};

export default Users;
