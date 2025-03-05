import Conversation from "../models/Conversation.model.js";
import { handleUpdateUserRT, io } from "../server.js"; // Import socket instance

//  Send Message
export const sendMessage = async (req, res) => {
  try {
    const { sender, receiverIds, text, group } = req.body;

    let conversation;
    if (group) {
      conversation = await Conversation.findOne({ group });
    } else {
      conversation = await Conversation.findOne({
        users: { $all: [sender, ...receiverIds] },
        group: null,
      });
    }

    if (!conversation) {
      conversation = await Conversation.create({
        users: group ? null : [sender, ...receiverIds],
        group: group || null,
        messages: [],
      });
    }

    const message = { sender, receivers: receiverIds, text };
    conversation.messages.push(message);
    await conversation.save();

    handleUpdateUserRT(receiverIds, "newMessage", {
      message,
      conversationId: conversation._id,
    });

    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Get All Conversations of a User
export const getAllConversations = async (req, res) => {
  try {
    const { userId } = req.params;
    const conversations = await Conversation.find({
      $or: [{ users: userId }, { group: { $ne: null } }],
    })
      .populate("users") // Populating users in the conversation
      .populate({
        path: "group",
        populate: { path: "members", select: "name" }, // Populating group members
      })
      .populate({
        path: "messages",
        populate: [
          { path: "sender", select: "name" }, // Populating sender details
          { path: "receivers", select: "name" }, // Populating receivers
          // { path: "reads", select: "name" }, // Populating users who read the message
        ],
      });

    const transformed = conversations.map((conversation) => {
      const lastMessage =
        conversation.messages.length > 0
          ? conversation.messages[conversation.messages.length - 1]?.text ||
            "File"
          : "No messages yet";

      const lastTime =
        conversation.messages.length > 0
          ? conversation.messages[conversation.messages.length - 1].timestamp
          : conversation.createdAt;

      const unReadCount = conversation.messages.filter(
        (msg) =>
          msg.sender._id.toHexString() !== userId && !msg.reads.includes(userId)
      ).length;

      if (!!conversation.group) {
        return {
          id: conversation._id,
          name: conversation.group.name,
          isGroup: true,
          lastMessage,
          lastTime,
          members: conversation.group.members,
          group: conversation.group._id,
          unReadCount,
          messages: conversation.messages,
        };
      } else {
        const otherUser = conversation.users.find(
          (user) => user._id.toString() !== userId
        );

        return {
          id: conversation._id,
          name: otherUser.name,
          isGroup: false,
          lastMessage,
          lastTime,
          otherUser,
          unReadCount,
          messages: conversation.messages,
        };
      }
    });

    res.json(
      // conversations
      transformed.sort((a, b) => new Date(b.lastTime) - new Date(a.lastTime))
    );
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Get All Messages of a Conversation
export const getMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId).populate(
      "messages.sender messages.receivers messages.reads"
    );

    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    res.json(conversation.messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

//  Read Conversation
export const readConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.body;

    const conversation = await Conversation.findById(conversationId);
    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    conversation.messages.forEach((msg) => {
      if (!msg.reads.includes(userId)) msg.reads.push(userId);
    });

    await conversation.save();
    res
      .status(200)
      .json({ message: "Conversation marked as read", conversation });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a conversation
export const deleteConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId).populate(
      "group"
    );
    const receiverIds = conversation?.group
      ? conversation.group.members
      : conversation.users;

    handleUpdateUserRT(receiverIds, "newMessage", {
      conversationId: conversation._id,
    });
    await Conversation.findByIdAndDelete(conversationId);
    res.json({ message: "Conversation deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Clear messages of a conversation
export const clearConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId).populate(
      "group"
    );

    if (!conversation)
      return res.status(404).json({ message: "Conversation not found" });

    //@ts-ignore
    conversation.messages = [];

    const receiverIds = conversation?.group
      ? conversation.group.members
      : conversation.users;

    handleUpdateUserRT(receiverIds, "newMessage", {
      conversationId: conversation._id,
    });
    await conversation.save();

    res.json({ message: "Conversation cleared" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
