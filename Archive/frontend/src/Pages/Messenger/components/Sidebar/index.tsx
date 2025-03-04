import React, { useState, useEffect, useRef } from "react";
import { fetchConversations } from "../../../../api/conversation";
import { fetchFilteredChats } from "../../../../api/conversation";
import { BiSolidMessageSquareAdd } from "react-icons/bi";
import { MdGroupAdd, MdArrowBack } from "react-icons/md";
import { FaUserCircle } from "react-icons/fa";
import Conversations from "./Conversations";
import AllUsers from "./AllUsers";
import Group from "./Group";

const Sidebar = ({ setCurrentConvo, conversations, handleGroupCreatedByUser }) => {
  const [mode, setMode] = useState("chats");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");
  const [hover, setHover] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const [profilePic, setProfilePic] = useState(localStorage.getItem("profilePic") || "");
  const dropdownRef = useRef(null);

  useEffect(() => {
    setProfilePic(localStorage.getItem("profilePic") || "");
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowOptions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);



  // Function to toggle between "New Chat" and "New Group"
  const handleNewChatClick = () => {
    setMode(mode === "chats" ? "users" : "group");
  };

  //Function to handle file selection and upload
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profilePicture", file);

    const token = localStorage.getItem("token");
    if(!token) {
      console.error("No token found in localStorage");
      return;
    }

    try{
      const response = await fetch("http://localhost:5000/api/users/upload-profile", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          // Authorization: `Bearer ${localStorage.getItem("token")}`, //send token
        },
        body: formData,
      });

      const data = await response.json();

      if(response.ok) {
        const fullImageUrl = `http://localhost:5000${data.user.profilePicture}`; // Fix URL

        setProfilePic(fullImageUrl);
        localStorage.setItem("profilePic", fullImageUrl);
        alert("Profile picture updated successfully");
      } else {
        alert(data.error || "Failed to update profile picture");
      }
    } catch (error) {
      console.error("Upload Error: ", error);
    }
  };



  //     if (response.ok) {
  //       setProfilePic(data.user.profilePicture);
  //       localStorage.setItem("profilePic", data.user.profilePicture);
  //       alert("Profile picture updated successfully");
  //     } else {
  //       alert(data.error || "Failed to update profile picture");
  //     }
  //   } catch (error) {
  //     console.error("Upload Error: ", error);
  //   }
  // };


  return (
    <div className="w-[45%] max-w-[800px] h-full bg-white py-2 px-3 relative flex flex-col">
      {/* Header Section (User Avatar & Floating Button) */}
      <div className="flex justify-between items-center mb-3 relative">
        {/* User Avatar & Name (Clickable) */}
        <div
          className="flex items-center space-x-2 cursor-pointer"
          onClick={() => setShowOptions(!showOptions)}
          ref={dropdownRef}
        >
           {/* Display Profile Picture or Default Icon */}
           <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-300 flex items-center justify-center">
           {profilePic ? (
              <img
                src={profilePic}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <FaUserCircle size={30} className="text-white" />
            )}
          </div>

          {/* Display User Name */}
          <span className="text-gray-700 font-medium">{localStorage.getItem("userName")}</span>
        </div>

        {/* Profile Options (Dropdown) */}
        {showOptions && (
          <div className="absolute top-12 left-0 bg-white shadow-md rounded-md w-40 p-2">
            <label 
            htmlFor= "fileInput" className="w-full text-left p-2 hover:bg-gray-100 cursor-pointer">
              Change Profile Picture
            </label>
            <input
              type="file"
              id="fileInput"
              className="hidden"
              accept="image/*"
              onChange={handleFileChange}
              />
          </div>
        )}

        {/* Floating Icon (New Chat / New Group) */}
        {mode !== "group" && (
          <button
            className="p-2 bg-gray-500 text-white rounded-full shadow-md hover:bg-gray-400 transition relative"
            onClick={handleNewChatClick}
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
          >
            {mode === "chats" ? <BiSolidMessageSquareAdd size={22} /> : <MdGroupAdd size={24} />}
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
                {type === "all" ? "All Chats" : type === "unread" ? "Unread" : "Groups"}
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