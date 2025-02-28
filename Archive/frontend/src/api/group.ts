const API_URL = "http://localhost:5000/api";

export const createGroup = async (members, name) => {
  try {
    const response = await fetch(`${API_URL}/groups`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        creator: localStorage.getItem("user"),
        members,
        name,
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to create group");
    }

    return await response.json();
  } catch (error) {
    console.error("Error creating group:", error);
    throw error;
  }
};
