import React, { useState, useEffect, useRef } from "react";
import { getNameInitials } from "../../../../../utils";
import { Search, MoreVertical, X, Phone, Users } from "lucide-react";

const Header = ({
  currentConvo,
  onClearChat,
  onDeleteChat,
  searchQuery,
  setSearchQuery,
  onHeaderClick,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    setDetailsOpen(false); 
  }, [currentConvo]);

  useEffect(() => {
    setMenuOpen(false); 
  }, [currentConvo]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);
  

  

  const DetailsPanel = () => (
    <div 
      className={`fixed inset-0 md:right-0 md:left-auto md:top-0 md:h-full md:w-80 transform ${
        detailsOpen ? 'translate-x-0' : 'translate-x-full'
      } transition-transform duration-300 ease-in-out z-50 bg-white border-l`}
    >
      <div className="p-4 h-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Details</h2>
          <button 
            onClick={() => setDetailsOpen(false)}
            className="p-2 rounded-full hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        <div className="flex flex-col items-center mb-6">
          <div className="w-24 h-24 bg-gray-200 rounded-full flex items-center justify-center mb-4">
            {currentConvo?.profilePicture ? (
              <img
                src={currentConvo.profilePicture.startsWith("http") 
                  ? currentConvo.profilePicture 
                  : `http://localhost:5000${currentConvo.profilePicture}`}
                alt="Profile"
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-3xl font-semibold text-gray-800">
                {getNameInitials(currentConvo?.name)}
              </span>
            )}
          </div>
          <h3 className="text-xl font-semibold">{currentConvo?.name}</h3>
          {!currentConvo?.isGroup && (
            <div className="flex items-center mt-2 text-gray-600">
              <Phone size={16} className="mr-2" />
              <span>+91 9797-123-766</span>
            </div>
          )}
          
        </div>

        {currentConvo?.isGroup && (
          <div className="border-t pt-4">
            <div className="flex items-center text-gray-600 mb-4">
              <Users size={18} className="mr-2" />
              <span>{currentConvo.members.length} members</span>
            </div>
            <div className="space-y-2">
              {currentConvo.members.map((member, index) => (
                <div key={index} className="flex items-center p-2 hover:bg-gray-100 rounded">
                  <div className="w-8 h-8 bg-gray-300 rounded-full mr-3 flex items-center justify-center">
                    {getNameInitials(member.name)}
                  </div>
                  <span>{member.name}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex">
      <div className={`bg-gray-100 p-2 flex justify-between items-center w-full ${
        detailsOpen ? 'hidden md:flex' : 'flex'
      }`}>
        <div 
          className="flex items-center gap-2 cursor-pointer p-2 rounded-md hover:bg-gray-200"
          onClick={() => setDetailsOpen(true)}
        >
          <div className="relative flex items-center justify-center w-[40px] h-[40px] bg-[#eeeeee] rounded-full overflow-hidden">
            {currentConvo?.profilePicture ? (
              <img
                src={currentConvo.profilePicture.startsWith("http") 
                  ? currentConvo.profilePicture 
                  : `http://localhost:5000${currentConvo.profilePicture}`}
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

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-gray-50 px-3 py-1 rounded-lg border">
            <input
              type="text"
              placeholder="Search messages..."
              className="bg-transparent outline-none"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Search size={20} className="text-gray-600 ml-2" />
          </div>

          <div className="relative" ref={menuRef}>
            <button
              className="p-2 rounded-full hover:bg-gray-200"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              <MoreVertical size={20} className="text-gray-600" />
            </button>
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-md py-2 z-50">
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
                  {currentConvo.isGroup ? 'Delete Group' : 'Delete Chat'}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      <DetailsPanel />
    </div>
  );
};

export default Header;