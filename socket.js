import Conversation from "./models/Conversation.js";
import Message from "./models/Message.js";

export default function registerSocketHandlers(io) {
    console.log("Socket Handlers called")

    io.on("connection", (socket) => {
        const userId = socket.handshake.auth.userId || socket.handshake.query.userId;
        console.log("Scoket connected", socket.id);

        if (userId) {
            socket.join(userId);
            console.log(`User ${userId} joined personal room`);
        }

        socket.on("join", (otherUserId) => {
            socket.join(otherUserId);
            console.log(`User ${userId} joined chat  with ${otherUserId}`);
        })

        socket.on("send-message", async (data) => {
            const { otherUserId, text } = data;
            try {
                let conversation = await Conversation.findOne({
                    participants: { $all: [userId, otherUserId] }
                }).populate("participants", "name phone");

                let isNew = false;
                if (!conversation) {
                    isNew = true;
                    conversation = new Conversation({
                        participants: [userId, otherUserId],
                        unreadCounts: {
                            [userId.toString()]: 0,
                            [otherUserId.toString()]: 0
                        }
                    });
                    await conversation.save();
                }

                const message = new Message({
                    conversationId: conversation._id,
                    senderId: userId,
                    text,
                    status: "sent"
                });
                await message.save();

                //update unreadcount
                const currentUnread = conversation.unreadCounts.get(otherUserId.toString()) || 0;
                conversation.unreadCounts.set(otherUserId.toString(), currentUnread + 1);
                conversation.unreadCounts.set(userId.toString(), 0);
                conversation.lastMessage = message._id;
                await conversation.save();

                const populatedMessage = await Message.findById(message._id)
                    .populate("senderId", "name phone");

                io.to(otherUserId).emit("receive-message", {
                    message: populatedMessage,
                    conversation,
                    isNew
                });

                socket.emit("message-sent", {
                    message: populatedMessage,
                    conversation,
                    isNew
                });

            } catch (error) {
                console.error("Error sending message:", error);
            }
        });
        socket.on("focus-conversation", async (conversationId) => {
            try {
                const conversation = await Conversation.findById(conversationId);
                if (!conversation) {
                    return
                }
                conversation.unreadCounts.set(userId.toString(), 0);
                await conversation.save();

            } catch (error) {
                console.log("Focus converation error", error)
            }
        })

    })
}