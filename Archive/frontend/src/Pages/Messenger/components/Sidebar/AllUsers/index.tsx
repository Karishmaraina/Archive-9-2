import React, { useEffect, useState } from "react";
import { getAllUsers } from "../../../../../api/user";
import { getNameInitials } from "../../../../../utils";

const AllUsers = ({ selectConvo }) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        setUsers(
          data.filter((user) => user._id !== localStorage.getItem("user"))
        );
      } catch (error) {
        console.error("Failed to fetch users", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const User = ({ id, name }) => (
    <div
      className="mb-2 flex cursor-pointer items-center gap-2 rounded-md border p-2 hover:bg-slate-50"
      onClick={() =>
        selectConvo({
          id,
          title: name,
        })
      }
    >
      <div className="relative flex h-[40px] w-[40px] items-center justify-center rounded-full bg-[#eeeeee]">
        {getNameInitials(name)}
      </div>
      <h1 className="text-lg">{name}</h1>
    </div>
  );

  return (
    <div className="px-2">
      <h1 className="mt-2 mb-4 text-xl font-semibold text-black">
        Start a new chat
      </h1>
      {loading ? (
        <p className="my-6 text-center">Loading users...</p>
      ) : users.length === 0 ? (
        <p className="my-6 text-center">No other users found...</p>
      ) : (
        users.map((user) => (
          <User key={user._id} id={user._id} name={user.name} />
        ))
      )}
    </div>
  );
};

export default AllUsers;
