import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import axios from "axios";
import {
  clearConversation,
  deleteConversation,
  fetchConversations,
  getMessages,
  markAsRead,
  sendMessage,
} from "../api/conversation";
//NEWWWWWWWWWWWWWW
import { Conversation } from "../../../types";
// const [conversations, setConversations] = useState<Conversation[]>([]);

const socket = io("http://localhost:5000");

const API_URL = "http://localhost:5000/api";

const useChat = () => {
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [current, setCurrent] = useState(null);

  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const userId = localStorage.getItem("user");
    if (!userId) return;

    socket.emit("join", userId);

    return () => {
      // socket.off("newMessage");
      // socket.off("newGroup");
    };
  }, []);

  useEffect(() => {
    const userId = localStorage.getItem("user");
    if (!userId) return;

    const getConversations = async () => {
      try {
        const data = await fetchConversations(userId);
        console.log(data);

        setConversations(data);
        if (current?.id && current?.clientSide) {
          const item = data.find(
            (convo) => convo.otherUser._id === current?.id
          );

          setCurrent(item);
        }
      } catch (error) {
        console.error("Failed to load conversations");
      }
    };

    getConversations();
  }, [toggle]);

  useEffect(() => {
    socket.on("newMessage", (data) => {
      setToggle((prev) => !prev);
    });

    socket.on("groupCreated", (data) => {
      setToggle((prev) => !prev);
    });

    return () => {
      socket.off("newMessage");
      socket.off("groupCreated");
    };
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      const data = await getMessages(current?.id);
      if (data) {
        setMessages(data);
      }
    };

    if (current?.id && !current?.clientSide) {
      fetchMessages();
      markAsRead(current?.id);
    }
  }, [current?.id, toggle]);

  useEffect(() => {
    if (current?.id) {
      console.log(current);
      const temp = current;
      temp.unReadCount = 0;
      setCurrent(temp);
    }
  }, [current?.id]);

  const handleSendMessage = async (msg, file = null) => {
    let fileUrl = null;
  
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
  
      try {
        const uploadResponse = await fetch(`${API_URL}/upload`, {
          method: "POST",
          body: formData,
        });
  
        const uploadData = await uploadResponse.json();
        
        if (uploadData.url) {
          fileUrl = uploadData.url;
        } else {
          console.error("File upload failed", uploadData.error);
          return;
        }
  
      } catch (error) {
        console.error("File upload error:", error);
        return;
      }
    }
  
    const payload = {
      sender: localStorage.getItem("user"),
      receiverIds: current?.isGroup
        ? current?.members
            .map((member) => member._id)
            .filter((id) => id !== localStorage.getItem("user"))
        : [current?.otherUser?._id],
      text: msg.text,
      fileUrl: fileUrl, 
      group: current?.isgroup ? current?.id : null,
    };
  
    await sendMessage(payload);
    setToggle((prev) => !prev);
  };
  
  const addClientSideConversation = (id, name) => {
    const temp = {
      id: id,
      name: name,
      isGroup: false,
      lastMessage: "",
      lastTime: new Date(),
      otherUser: {
        _id: id,
        name: name,
      },
      unReadCount: 0,
      clientSide: true,
    };

    setCurrent(temp);
  };

  const handleGroupCreatedByUser = () => {
    setToggle((prev) => !prev);
  };

  const handleDeleteChat = async () => {
    await deleteConversation(current?.id);
    setCurrent(null);
    setToggle((prev) => !prev);
  };

  const handleClearChat = async () => {
    await clearConversation(current?.id);
    setMessages([]);
    setToggle((prev) => !prev);
  };

  return {
    conversations,
    messages,
    current,
    setCurrent,
    handleSendMessage,
    addClientSideConversation,
    handleGroupCreatedByUser,
    handleDeleteChat,
    handleClearChat,
  };
};

export default useChat;
