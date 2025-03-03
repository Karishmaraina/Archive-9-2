import React from "react";
import { getNameInitials } from "../../../../../utils";

const Conversations = ({ conversations, selectConvo, filter, searchQuery }) => {
  const Conversation = ({
    title,
    id,
    lastMessage,
    isGroup,
    members,
    unreadCount,
    profilePicture
  }) => {
    return (
      <div
        className="flex gap-2 items-center border-[1px] cursor-pointer p-2 rounded-sm mb-2 hover:bg-slate-50"
        onClick={() => selectConvo({ isGroup, id: id, title, members })}
      >
        <div className="flex justify-center items-center bg-[#eeeeee] w-[40px] h-[40px] rounded-full relative">
          {getNameInitials(title)}
          <span className="bg-green-500 inline-block w-[10px] h-[10px] rounded-xl absolute bottom-[1px] right-[1px] border-[1px] border-white"></span>
        </div>
        <div className="flex justify-between items-center flex-grow">
          <div>
            <h1 className="text-lg">{title}</h1>
            <p className="text-sm text-slate-600">{lastMessage}</p>
          </div>
          {unreadCount !== 0 && (
            <div
              style={{
                width: "18px",
                height: "18px",
                fontSize: "12px",
                borderRadius: "50%",
                backgroundColor: "#22c55d",
                color: "#ffffff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {unreadCount}
            </div>
          )}
        </div>
      </div>
    );
  };

  const getSearchedChats = (chats) => {
    if (!searchQuery.trim()) return chats;

    const priority1 = chats.filter((chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const priority2 = chats.filter((chat) => {
      const texts = chat.messages.map((msg) => msg.text);

      for (const text of texts) {
        if (text.toLowerCase().includes(searchQuery.toLowerCase())) return true;
      }

      return false;
    });

    return [...new Set([...priority1, ...priority2])];
  };

  const getFilteredConversations = () => {
    let result = [];
    if (filter === "all") result = conversations;
    if (filter === "unread")
      result = conversations.filter((convo) => convo.unReadCount > 0);
    if (filter === "groups")
      result = conversations.filter((convo) => convo.isGroup);

    return getSearchedChats(result);
  };

  return (
    <div className="px-2">
      <h1 className="text-xl text-black font-semibold mt-2 mb-4">Chats</h1>
      <div>
        {getFilteredConversations().length === 0 ? (
          <p className="text-center my-8">No chats found</p>
        ) : (
          getFilteredConversations().map((convo) => (
            <Conversation
              key={convo.id}
              id={convo.id}
              title={convo.name}
              lastMessage={convo.lastMessage}
              isGroup={convo.isGroup}
              members={convo.members}
              unreadCount={convo.unReadCount}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Conversations;
