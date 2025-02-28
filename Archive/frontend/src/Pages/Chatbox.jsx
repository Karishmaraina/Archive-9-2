import React, { useState, useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { FaPaperclip, FaDownload, FaCheck, FaRegSmile } from "react-icons/fa";

const socket = io("http://localhost:5000");

const Button = ({ children, onClick, className, disabled }) => (
  <button
    className={`bg-[#00a884] text-white px-4 py-2 rounded-lg hover:bg-[#008069] transition-colors ${
      disabled ? "opacity-50 cursor-not-allowed" : ""
    } ${className}`}
    onClick={onClick}
    disabled={disabled}
  >
    {children}
  </button>
);

const employees = [
  { name: "Karishma Raina", online: true, lastSeen: "Online" },
  { name: "Tushar Garg", online: false, lastSeen: "Last seen 2h ago" },
  { name: "Shubham Mehta", online: true, lastSeen: "Online" },
  { name: "Bob Marley", online: false, lastSeen: "Last seen yesterday" },
  { name: "Rohan Sharma", online: true, lastSeen: "Online" },
  { name: "Osh", online: true, lastSeen: "Online" },
];

const Chatbox = () => {
  const [activeChats, setActiveChats] = useState(["Karishma Raina"]);
  const [selectedEmployee, setSelectedEmployee] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [messages, setMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [file, setFile] = useState(null);
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const messageHandler = (data) => {
      setMessages((prevMessages) => {
        const existingMessages = prevMessages[data.chat] || [];
        if (!existingMessages.some((msg) => msg.id === data.id)) {
          return {
            ...prevMessages,
            [data.chat]: [...existingMessages, data],
          };
        }
        return prevMessages;
      });
    };

    socket.on("message", messageHandler);
    return () => socket.off("message", messageHandler);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages[currentChat]]);

  const startChat = () => {
    if (selectedEmployee && !activeChats.includes(selectedEmployee)) {
      setActiveChats([...activeChats, selectedEmployee]);
    }
  };

  const sendMessage = async () => {
    if ((!newMessage && !file) || isSending) return;

    setIsSending(true);
    const id = Date.now().toString();
    const timestamp = new Date().toLocaleString();

    try {
      let fileData = null;
      if (file) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("http://localhost:5000/upload", {
          method: "POST",
          body: formData,
        });

        const fileInfo = await response.json();
        fileData = {
          name: file.name,
          path: fileInfo.filename,
        };
      }

      const newMsg = {
        id,
        chat: currentChat,
        text: newMessage,
        file: fileData,
        timestamp,
        sender: "67a47b08b1116aca05000bb0",
      };

      setMessages((prev) => ({
        ...prev,
        [currentChat]: [...(prev[currentChat] || []), newMsg],
      }));

      socket.emit("message", newMsg);
      setNewMessage("");
      setFile(null);
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      {/* Left Sidebar */}
      <div className="w-1/3 border-r bg-white">
        <div className="p-4 bg-[#f0f2f5]">
          <div className="flex items-center space-x-2">
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-[#41525d]">Chats</h2>
            </div>
          </div>
        </div>

        {/* Start New Chat */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-2">
            <select
              className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#00a884]"
              onChange={(e) => setSelectedEmployee(e.target.value)}
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.name} value={emp.name}>
                  {emp.name}
                </option>
              ))}
            </select>
            <Button onClick={startChat} className="px-3 py-2">
              Start
            </Button>
          </div>
        </div>

        {/* Active Chats List */}
        <div className="overflow-y-auto h-[calc(100vh-160px)]">
          {activeChats.map((chatName) => {
            const employee = employees.find((e) => e.name === chatName);
            return (
              <div
                key={chatName}
                className={`flex items-center p-3 cursor-pointer hover:bg-[#f5f6f6] ${
                  currentChat === chatName ? "bg-[#f0f2f5]" : ""
                }`}
                onClick={() => setCurrentChat(chatName)}
              >
                <div className="relative">
                  <div className="w-12 h-12 rounded-full bg-[#dfe5e7] flex items-center justify-center">
                    <span className="text-[#54656f]">{chatName.charAt(0)}</span>
                  </div>
                  {employee?.online && (
                    <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  )}
                </div>
                <div className="ml-4 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-semibold text-[#111b21]">{chatName}</h3>
                    <span className="text-xs text-[#667781]">
                      {
                        messages[chatName]?.[messages[chatName].length - 1]
                          ?.timestamp
                      }
                    </span>
                  </div>
                  <p className="text-sm text-[#667781] truncate">
                    {messages[chatName]?.[messages[chatName].length - 1]
                      ?.text || "Start chatting"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right Chat Area */}
      <div className="flex-1 flex flex-col">
        {currentChat ? (
          <>
            <div className="p-4 bg-[#f0f2f5] border-b flex items-center">
              <div className="flex items-center">
                <div className="w-10 h-10 rounded-full bg-[#dfe5e7] flex items-center justify-center">
                  {currentChat.charAt(0)}
                </div>
                <div className="ml-4">
                  <h2 className="font-semibold text-[#111b21]">
                    {currentChat}
                  </h2>
                  <p className="text-sm text-[#667781]">
                    {employees.find((e) => e.name === currentChat)?.lastSeen}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto bg-[#efeae2] p-4">
              {messages[currentChat]?.map((msg, index) => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === "67a47b08b1116aca05000bb0"
                      ? "justify-end"
                      : "justify-start"
                  } mb-4`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sender === "user" ? "bg-[#d9fdd3]" : "bg-white"
                    }`}
                  >
                    {msg.text && <p className="text-[#111b21]">{msg.text}</p>}
                    {msg.file && (
                      <div className="mt-2 p-2 bg-[#ffffff80] rounded-lg">
                        <div className="flex items-center">
                          <FaDownload className="mr-2 text-[#667781]" />
                          <a
                            href={`http://localhost:5000/download/${msg.file.path}`}
                            download={msg.file.name}
                            className="text-[#008069] hover:underline"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {msg.file.name}
                          </a>
                        </div>
                        <span className="text-xs text-[#667781]">
                          Click to download
                        </span>
                      </div>
                    )}
                    <div className="flex items-center justify-end space-x-1 mt-1">
                      <span className="text-xs text-[#667781]">
                        {msg.timestamp}
                      </span>
                      <FaCheck className="text-xs text-[#667781]" />
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-4 bg-[#f0f2f5] border-t">
              <div className="flex items-center space-x-2">
                <button className="text-[#667781] hover:text-[#008069] p-2">
                  <FaRegSmile size={20} />
                </button>
                <input
                  type="file"
                  className="hidden"
                  id="fileUpload"
                  accept=".jpeg,.jpg,.png,.pdf,.docx,.xls"
                  onChange={(e) => setFile(e.target.files[0])}
                />
                <label
                  htmlFor="fileUpload"
                  className="text-[#667781] hover:text-[#008069] cursor-pointer p-2"
                >
                  <FaPaperclip size={20} />
                </label>
                <input
                  type="text"
                  className="flex-1 p-2 rounded-lg border focus:outline-none focus:ring-2 focus:ring-[#00a884]"
                  placeholder="Type a message"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && sendMessage()}
                />
                <Button onClick={sendMessage} disabled={isSending}>
                  {isSending ? "Sending..." : "Send"}
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-[#f0f2f5]">
            <div className="text-center">
              <h2 className="text-2xl font-light text-[#41525d]">
                Select a chat to start messaging
              </h2>
              <p className="text-[#667781] mt-2">
                Your messages will appear here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chatbox;
