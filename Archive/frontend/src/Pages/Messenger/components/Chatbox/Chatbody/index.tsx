import React, { useEffect, useRef } from "react";
import Message from "./Message";

const Chatbody = ({ messages, query }) => {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Scroll to bottom when messages update
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  console.log({ messages });

  const transformMessagesForNonGroup = (arr) => {
    return [...arr].map((msg) => {
      if (msg.clientSide) return msg;
      return {
        sender:
          msg?.sender?._id === localStorage.getItem("user") ? "me" : "other",
        text: msg.text,
        time: msg.timeStamp,
      };
    });
  };

  return (
    <div className="flex-grow overflow-y-auto bg-[#efeae2] p-4">
      {transformMessagesForNonGroup(messages).map((msg, index) => (
        <Message
          key={index}
          isOther={msg.sender === "other"}
          text={msg.text}
          image={null}
          timeStamp={msg.time}
          query={query}
        />
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
};

export default Chatbody;
