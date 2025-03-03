const API_URL = "http://localhost:5000/api";

export const getMessages = async (conversationId) => {
  try {
    const response = await fetch(
      `${API_URL}/conversations/messages/${conversationId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    return await response.json(); // Convert response to JSON
  } catch (error) {
    console.error("Error fetching messages:", error);
    return null; // Handle errors gracefully
  }
};

export const fetchConversations = async () => {
  try {
    const response = await fetch(
      `${API_URL}/conversations/${localStorage.getItem("user")}`
    );

    if (!response.ok) {
      throw new Error("Failed to fetch conversations");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching conversations", error);
    throw error;
  }
};

//NEW CODEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE
// conversation.ts
// export const fetchFilteredChats = async (userId: string, filter: string, searchQuery: string) => {
//   if (!userId) {
//     console.error("fetchFilteredChats Error: userId is missing!");
//     return []; // Return empty array to prevent fetch error
//   }

//   try {
//     const response = await fetch(
//       `${API_URL}/conversations/filter/${userId}?filter=${filter}&search=${searchQuery}`
//     );
//     // ... handle response ...
//     if (!response.ok) throw new Error('Failed to fetch');
//     return await response.json();
//   } catch (error) {
//     console.error("Error fetching filtered chats:", error);
//     return [];
//   }
// };

export const fetchFilteredChats = async (
  userId: string,
  filter: string,
  searchQuery: string
) => {
  if (!userId) {
    console.error("fetchFilteredChats Error: Missing userId!");
    return []; // Return an empty array to prevent errors
  }

  try {
    const url = new URL(`${API_URL}/conversations/filter/${userId}`);
    url.searchParams.append("filter", filter || "all"); // Default to "all" if no filter
    if (searchQuery) {
      url.searchParams.append("search", encodeURIComponent(searchQuery));
    }

    const response = await fetch(url.toString());

    if (!response.ok) {
      throw new Error(`Failed to fetch conversations: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching filtered chats:", error);
    return [];
  }
};

// Update the conversion in useChat.ts where you setConversations
// setConversations(
// //   data.map((convo) => ({
// //     id: convo.id,
// //     title: convo.title,
// //     lastMessage: convo.lastMessage || "No messages yet",
// //     isGroup: convo.isGroup,
// //     members: convo.members // Now already in correct format
// //   }))
// // );

export const sendMessage = async ({ sender, receiverIds, text, fileUrl, group }) => {
  try {
    const response = await fetch(`${API_URL}/conversations/send-message`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender, receiverIds, text, file: fileUrl, group }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Send message error:", error);
    throw error;
  }
};

export const markAsRead = async (conversationId) => {
  try {
    const response = await fetch(
      `${API_URL}/conversations/read/${conversationId}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId: localStorage.getItem("user") }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Mark as read error:", error);
    throw error;
  }
};

export const deleteConversation = async (conversationId) => {
  try {
    const response = await fetch(`${API_URL}/conversations/${conversationId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Delete conversation error:", error);
    throw error;
  }
};

export const clearConversation = async (conversationId) => {
  try {
    const response = await fetch(
      `${API_URL}/conversations/clear/${conversationId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status} ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Clear conversation error:", error);
    throw error;
  }
};
