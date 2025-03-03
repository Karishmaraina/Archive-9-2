import React, { useState } from "react";
import { getNameInitials } from "../../../../../utils";
import { Search, MoreVertical } from "lucide-react"; // Importing icons from Lucide React

const Header = ({
  currentConvo,
  onClearChat,
  onDeleteChat,
  // onContactInfo,
  // onMuteNotifications,
  // onReport,
  // onBlock,
  searchQuery,
  setSearchQuery,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="bg-gray-100 p-2 flex justify-between items-center relative">
      <div className="flex items-center gap-2 cursor-pointer p-2 rounded-md">
        {/* Profile Picture with Default Fallback */}
        <div className="relative flex items-center justify-center w-[40px] h-[40px] bg-[#eeeeee] rounded-full overflow-hidden">
          {currentConvo?.profilePicture ? (
            <img
              src={currentConvo.profilePicture.startsWith("http") ? currentConvo.profilePicture :`http://localhost:5000${currentConvo.profilePicture}`}
              alt="Profile"
              className="w-full h-full object-cover"
              onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/40")}
              />
          ) : (
            <span className="text-lg font-semibold text-gray-800">
              {getNameInitials(currentConvo?.name)}
              </span>
          )}
        </div>
        {/*Chat Users name*/}
        <div>
          <h1 className="text-base font-normal text-slate-900">
            {currentConvo?.name}
          </h1>
          {currentConvo?.isGroup ? (
            <p className="mt-[-4px] text-xs text-slate-300">
              {currentConvo.members.length} members
            </p>
          ) : (
            <p className="mt-[-1px] text-xs text-slate-500">Online</p>
          )}
        </div>
      </div>
      {/* Search and Menu Options */}
      <div className="flex items-center gap-3">
        <div
          className="flex"
          style={{
            background: "#f1f1f1",
            padding: "6px 12px",
            borderRadius: "8px",
            border: "1px solid gainsboro",
          }}
        >
          <input
            type="text"
            placeholder="Search messages..."
            style={{ background: "none", outline: "none" }}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Search size={20} className="text-gray-600" />
        </div>

        <div className="relative">
          <button
            className="p-2 rounded-full hover:bg-gray-200"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <MoreVertical size={20} className="text-gray-600" />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2">
              {/* <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                // onClick={onContactInfo}
              >
                Contact Info
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                // onClick={onMuteNotifications}
              >
                Mute Notifications
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                // onClick={onReport}
              >
                Report
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                // onClick={onBlock}
              >
                Block
              </button> */}
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100"
                onClick={onClearChat}
              >
                Clear Chat
              </button>
              <button
                className="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 text-red-600"
                onClick={onDeleteChat}
              >
                {currentConvo.isGroup ? <>Delete Group</> : <>Delete Chat</>}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
