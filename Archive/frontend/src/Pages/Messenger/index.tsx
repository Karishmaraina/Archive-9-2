import React, { useEffect, useState } from "react";
import Sidebar from "./components/Sidebar";
import Chatbox from "./components/Chatbox";
import { Navigate, useNavigate } from "react-router-dom";
import useChat from "../../hooks/useChat";
import { getMessages, sendMessage } from "../../api/conversation";

const Messenger = () => {
  if (!localStorage.getItem("user")) return <Navigate to={"/login"} />;

  const {
    conversations,
    messages,
    current,
    setCurrent,
    handleSendMessage,
    addClientSideConversation,
    handleGroupCreatedByUser,
    handleDeleteChat,
    handleClearChat,
  } = useChat();

  return (
    <div className="flex h-[100dvh]">
      <Sidebar
        conversations={conversations}
        setCurrentConvo={(convo) => {
          if (conversations.findIndex((item) => item.id === convo.id) === -1) {
            addClientSideConversation(convo.id, convo.title);

            // const newConvo = {
            //   id: convo.id,
            //   lastMessage: "No messages yet",
            //   title: convo.title,
            // };
            // setConversations((prev) => [newConvo, ...prev]);
          } else {
            const conversation = conversations.find(
              (conversation) => conversation.id === convo.id
            );
            setCurrent(conversation);
          }
        }}
        handleGroupCreatedByUser={handleGroupCreatedByUser}
      />
      <Chatbox
        currentConvo={current}
        sendMessage={handleSendMessage}
        messages={messages}
        onClearChat={handleClearChat}
        onDeleteChat={handleDeleteChat}
      />
    </div>
  );
};

export default Messenger;