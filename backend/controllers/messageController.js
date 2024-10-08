const asyncHandler = require("express-async-handler");
const Message = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");


const fetchMessages = asyncHandler(async (req, res) => {
  try {
    const messages = await Message.find({ chat: req.params.chatId })
      .populate("sender", "name pic email")
      .populate("chat");
    res.json(messages);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});


const sendMessage = asyncHandler(async (req, res) => {
	const { content, chatId } = req.body;

	if (!content || !chatId) {
		// console.log("Invalid data passed into request");
		return res.sendStatus(400);
	}

	var newMessage = {
		sender: req.user._id,
		content: content,
		chat: chatId,
	};

	try {
		var message = await Message.create(newMessage);

		message = await message.populate("sender", "name pic").execPopulate();
		message = await message.populate("chat").execPopulate();
		message = await User.populate(message, {
			path: "chat.users",
			select: "name pic email",
		});

		await Chat.findByIdAndUpdate(req.body.chatId, { latestMessage: message });
		// console.log("model ", message);
		res.json(message);
	} catch (error) {
		res.status(400);
		throw new Error(error.message);
	}
});
const deleteMessage = asyncHandler(async (req, res) => {
	const id = req.params.id;
	try {
		// Find the message by ID and delete it
		const deletedMessage = await Message.findByIdAndDelete(id);

		if (deletedMessage) {
			res.json({ message: "Message deleted successfully", deletedMessage });
		} else {
			res.status(404).json({ message: "Message not found" });
		}
	} catch (error) {
		console.error(`Error deleting message: ${error.message}`);
		res.status(500).json({ message: "Server error" });
	}
});
const editMessage = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { content } = req.body;

	const updatedMessage = await Message.findByIdAndUpdate(
		id,
		{ content },
		{ new: true },
	);

	if (!updatedMessage) {
		res.status(404);
		throw new Error("Message not found");
	}

	res.json(updatedMessage);
});

module.exports = { fetchMessages, sendMessage, deleteMessage, editMessage };
