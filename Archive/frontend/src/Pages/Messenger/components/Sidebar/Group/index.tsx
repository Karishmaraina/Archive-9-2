import React, { useEffect, useState } from "react";
import { createGroup } from "../../../../../api/group";
import { getAllUsers } from "../../../../../api/user";
import { getNameInitials } from "../../../../../utils";

const Group = ({ goBack, handleGroupCreated }) => {
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const handleCreateGroup = async () => {
    if (members.length === 0 || !groupName) {
      alert("Group name and members are both required");
      return;
    }

    try {
      const response = await createGroup(members, groupName);
      alert(`Group created: ${response.group.name}`);
      handleGroupCreated(response.group);
      goBack();
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Error creating group. Please try again.");
    }
  };

  const User = ({ id, name }) => {
    const isSelected = members.includes(id);

    const toggleMember = (id) => {
      const temp = [...members];
      if (isSelected) {
        const index = members.findIndex((member) => member === id);
        temp.splice(index, 1);
      } else {
        temp.push(id);
      }
      setMembers(temp);
    };

    return (
      <div
        className={`flex gap-2 items-center border cursor-pointer p-2 rounded-sm mb-2 hover:bg-slate-50 ${
          isSelected ? "border-green-500" : "border-gray-300"
        }`}
        onClick={() => toggleMember(id)}
      >
        <div className="flex justify-center items-center bg-[#eeeeee] w-[40px] h-[40px] rounded-full relative">
          {getNameInitials(name)}
        </div>
        <div>
          <h1 className="text-lg">{name}</h1>
        </div>
      </div>
    );
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getAllUsers();
        const currentUserId = localStorage.getItem("user") || "";
        setUsers(data.filter((user) => user._id !== currentUserId));
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="px-2">
      <h1 className="text-xl text-black font-semibold mt-2 mb-4">
        Add a new group
      </h1>

      <input
        type="text"
        placeholder="Enter group name"
        className="w-full px-3 py-2 text-lg border border-gray-300 rounded-md outline-none mb-4"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      <div>
        <h1 className="mb-2">Choose group members</h1>
        {loading ? (
          <p className="text-center my-6">Loading users...</p>
        ) : users.length === 0 ? (
          <p className="text-center my-6">No other users found...</p>
        ) : (
          users.map((user) => (
            <User key={user._id} id={user._id} name={user.name} />
          ))
        )}
      </div>

      <button
        className="w-full bg-gray-500 text-white py-2 mt-4 rounded-md hover:bg-gray-400 transition duration-300"
        onClick={handleCreateGroup}
      >
        Create Group
      </button>
    </div>
  );
};

export default Group;
