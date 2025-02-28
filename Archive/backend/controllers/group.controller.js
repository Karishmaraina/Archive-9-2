import Group from "../models/Group.model.js";
import Conversation from "../models/Conversation.model.js";

import { handleUpdateUserRT, io } from "../server.js"; // Import socket instance

// ✅ Create a Group and Initialize Conversation
export const createGroup = async (req, res) => {
  try {
    const { name, members, creator } = req.body;

    const group = await Group.create({
      name,
      members: [...members, creator],
      creator,
    });

    const conversation = await Conversation.create({
      users: null,
      group: group._id,
      messages: [],
    });

    handleUpdateUserRT(members, "groupCreated", {
      message: `You were added to a new group: ${name}`,
      group,
    });

    res.status(201).json({ message: "Group created", group });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
