import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  receivers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  reads: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
  text: { type: String, default: "", required: false},
  timestamp: { type: Date, default: Date.now },
  fileUrl: { type: String, required: false },
});

const conversationSchema = new mongoose.Schema(
  {
    users: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      default: null,
    },
    messages: [messageSchema],
    profilePicture: String,
  },
  { timestamps: true }
);

const Conversation = mongoose.model("Conversation", conversationSchema);
export default Conversation;
