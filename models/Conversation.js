import mongoose from "mongoose";

const ConversationsSchema = new mongoose.Schema({
  participants: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    validate: [arr => arr.length === 2, "A conversation must have 2 participants"]
  },
  unreadCounts: {
    type: Map,
    of: Number,
    default: {}
  },
  lastMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Message"
  }
}, { timestamps: true });

export default mongoose.model("Conversation", ConversationsSchema);

