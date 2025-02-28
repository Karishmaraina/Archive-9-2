import React, { useState, useEffect } from "react";
import { fetchConversations } from "../../../../api/conversation"; // Import API function
import { fetchFilteredChats } from "../../../../api/conversation";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { MdGroupAdd, MdArrowBack } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import Conversations from "./Conversations";
import AllUsers from "./AllUsers";
import Group from "./Group";
import { io } from "socket.io-client";

const Sidebar = ({
  setCurrentConvo,
  conversations,
  handleGroupCreatedByUser,
}) => {
  const [mode, setMode] = useState("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [hover, setHover] = useState(false);

  // Function to toggle between "New Chat" and "New Group"
  const handleNewChatClick = () => {
    setMode(mode === "chats" ? "users" : "group");
  };

  return (
    <div className="w-[45%] max-w-[800px] h-full bg-white py-2 px-3 relative flex flex-col">
      {/* Header Section (User Avatar & Floating Button) */}
      <div className="flex justify-between items-center mb-3">
        {/* User Avatar */}
        <div className="flex items-center space-x-2">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center text-white text-lg">
            {localStorage.getItem("userName")?.charAt(0).toUpperCase() || (
              <FaUserCircle size={30} />
            )}
          </div>
          <span className="text-gray-700 font-medium">
            {localStorage.getItem("userName")}
          </span>
        </div>

        {/* Floating Icon (New Chat / New Group) */}
        {mode !== "group" && (
          <button
            className="p-2 bg-gray-500 text-white rounded-full shadow-md hover:bg-gray-400 transition relative"
            onClick={handleNewChatClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {mode === "chats" ? (
              <BiSolidMessageSquareAdd size={22} />
            ) : (
              <MdGroupAdd size={24} />
            )}
            {hover && (
              <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded-md">
                {mode === "chats" ? "New Chat" : "New Group"}
              </span>
            )}
          </button>
        )}
      </div>

      <hr />

      {/* Search Bar & Filters */}
      {mode === "chats" && (
        <div className="p-2">
          <input
            type="text"
            placeholder="Search chats..."
            className="w-full px-4 py-2 text-base outline-none rounded-md bg-gray-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />

          <div className="flex justify-around mt-2 text-sm">
            {["all", "unread", "groups"].map((type) => (
              <button
                key={type}
                className={`px-3 py-1 rounded-full transition ${
                  filter === type
                    ? "bg-green-100 text-green-700"
                    : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                }`}
                onClick={() => setFilter(type)}
              >
                {type === "all"
                  ? "All Chats"
                  : type === "unread"
                  ? "Unread"
                  : "Groups"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat List (Direct API-Based Filtering) */}
      {mode === "chats" && (
        <div className="flex-1 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          <Conversations
            conversations={conversations}
            selectConvo={setCurrentConvo}
            filter={filter}
            searchQuery={searchQuery}
          />
        </div>
      )}

      {mode === "users" && (
        <AllUsers
          selectConvo={(convo) => {
            setCurrentConvo(convo);
            setMode("chats");
          }}
        />
      )}

      {mode === "group" && (
        <Group
          goBack={() => {
            setMode("chats");
            handleGroupCreatedByUser();
          }}
          handleGroupCreated={() => {}}
        />
      )}

      {/* Back Button */}
      {mode !== "chats" && (
        <button
          className="absolute top-2 left-3 p-2 bg-gray-200 text-gray-900 rounded-full shadow-md hover:bg-gray-300 transition"
          onClick={() => setMode("chats")}
        >
          <MdArrowBack size={24} />
        </button>
      )}
    </div>
  );
};

export default Sidebar;
