import React from "react";
import moment from "moment";

const Message = ({ isOther, text, timeStamp, query }) => {
  const highlightText = (text) => {
    if (!query) return text;
    const regex = new RegExp(`(${query})`, "gi");
    return text.split(regex).map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span
          key={index}
          style={{ backgroundColor: "yellow", fontWeight: "bold" }}
        >
          {part}
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <div className={`flex ${isOther ? "justify-start" : "justify-end"} mb-4`}>
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOther ? "bg-white" : "bg-[#d9fdd3]"
        }`}
      >
        <p className="text-sm text-[#111b21]">{highlightText(text)}</p>
        <div className="flex justify-end mt-1">
          <span className="text-[9px] text-[#667781]">
            {moment(timeStamp).fromNow()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Message;
