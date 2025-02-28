import React, { useState } from "react";
import Chatbody from "./Chatbody";
import Footer from "./Footer";
import Header from "./Header";

const Chatbox = ({
  currentConvo,
  sendMessage,
  messages,
  onDeleteChat,
  onClearChat,
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  return (
    <div className="h-full w-full flex flex-col bg-slate-100">
      {currentConvo ? (
        <>
          <Header
            currentConvo={currentConvo}
            onClearChat={onClearChat}
            onDeleteChat={onDeleteChat}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
          />
          <Chatbody messages={messages} query={searchQuery} />
          <Footer sendMessage={sendMessage} />
        </>
      ) : (
        <div className="flex flex-col items-center justify-center h-full text-center">
          <h1 className="text-2xl text-slate-700">Start messaging</h1>
          <p className="text-lg text-slate-500">
            Your messages will appear here
          </p>
        </div>
      )}
    </div>
  );
};

export default Chatbox;
