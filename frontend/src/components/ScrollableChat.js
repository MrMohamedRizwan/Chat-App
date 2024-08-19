import React, { useState, useEffect } from "react";
import {
	Avatar,
	Box,
	Tooltip,
	IconButton,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
	Input,
	Button,
} from "@chakra-ui/react";
import { HamburgerIcon } from "@chakra-ui/icons";
import { ChatState } from "../context/chatProvider";
import {
	isLastMessage,
	isSameSender,
	isSameSenderMargin,
	isSameUser,
} from "../config/ChatLogics";
import axios from "axios";
import { API_URL } from "../configurations/config";

const ScrollableChat = ({ messages }) => {
	const [localMessages, setLocalMessages] = useState(messages || []);
	const { user } = ChatState();
	const [hoveredMessageId, setHoveredMessageId] = useState(null);
	const [confirmationId, setConfirmationId] = useState(null);
	const [editingMessageId, setEditingMessageId] = useState(null);
	const [newContent, setNewContent] = useState("");

	useEffect(() => {
		setLocalMessages(messages);
	}, [messages]);

	const deleteMessage = async (id) => {
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			};
			const response = await axios.delete(`${API_URL}/api/message/delete/${id}`, config);
			// console.log("Message deleted:", response.data);

			setLocalMessages(localMessages.filter((message) => message._id !== id));
		} catch (error) {
			console.error("Error deleting message:", error);
		}
	};

	const editMessage = async (id, content) => {
		try {
			const config = {
				headers: {
					"Content-type": "application/json",
					Authorization: `Bearer ${user.token}`,
				},
			};
			const response = await axios.put(
				`${API_URL}/api/message/edit/${id}`,
				{ content },
				config,
			);
			// console.log("Message edited:", response.data);

			setLocalMessages(
				localMessages.map((message) =>
					message._id === id
						? { ...message, content: response.data.content }
						: message,
				),
			);
			setEditingMessageId(null);
		} catch (error) {
			console.error("Error editing message:", error);
		}
	};

	const handleDeleteClick = (id) => {
		setConfirmationId(id);
	};

	const handleEditClick = (id, content) => {
		setEditingMessageId(id);
		setNewContent(content);
	};

	const handleEditSubmit = (id) => {
		editMessage(id, newContent);
	};

	const cancelDelete = () => {
		setConfirmationId(null);
	};

	return (
		<Box>
			{localMessages &&
				localMessages.map((m, i) => (
					<div
						style={{ display: "flex", alignItems: "center" }}
						key={m._id}
						onMouseEnter={() => setHoveredMessageId(m._id)}
						onMouseLeave={() => setHoveredMessageId(null)}>
						{(isSameSender(localMessages, m, i, user._id) ||
							isLastMessage(localMessages, i, user._id)) && (
							<Tooltip label={m.sender.name} placement='bottom-start' hasArrow>
								<Avatar
									mt='7px'
									mr={1}
									size='sm'
									cursor='pointer'
									name={m.sender.name}
									src={m.sender.pic}
								/>
							</Tooltip>
						)}
						<span
							style={{
								backgroundColor: `${
									m.sender._id === user._id ? "#BEE3F8" : "#B9F5D0"
								}`,
								marginLeft: isSameSenderMargin(localMessages, m, i, user._id),
								marginTop: isSameUser(localMessages, m, i, user._id) ? 3 : 10,
								borderRadius: "20px",
								padding: "5px 15px",
								maxWidth: "75%",
								position: "relative",
							}}>
							{editingMessageId === m._id ? (
								<Box>
									<Input
										value={newContent}
										onChange={(e) => setNewContent(e.target.value)}
										size='sm'
									/>
									<Button
										onClick={() => handleEditSubmit(m._id)}
										size='sm'
										mt={2}>
										Save
									</Button>
									<Button
										onClick={() => setEditingMessageId(null)}
										size='sm'
										mt={2}
										ml={2}>
										Cancel
									</Button>
								</Box>
							) : (
								m.content
							)}
							{hoveredMessageId === m._id && (
								<Menu>
									<MenuButton
										as={IconButton}
										icon={<HamburgerIcon />}
										variant='outline'
										size='sm'
										position='absolute'
										left={m.sender._id === user._id ? "-25px" : "unset"}
										right={m.sender._id !== user._id ? "-25px" : "unset"}
										bottom='5px'
										aria-label='Options'
									/>
									<MenuList>
										<MenuItem onClick={() => handleEditClick(m._id, m.content)}>
											Edit
										</MenuItem>
										<MenuItem onClick={() => handleDeleteClick(m._id)}>
											Delete
										</MenuItem>
									</MenuList>
								</Menu>
							)}
							{confirmationId === m._id && (
								<div className='flex flex-col'>
									<p>Are you sure you want to delete this message?</p>
									<div>
										<Button
											size='sm'
											mt={2}
											ml={2}
											onClick={() => deleteMessage(m._id)}>
											Yes
										</Button>
										<Button size='sm' mt={2} ml={2} onClick={cancelDelete}>
											No
										</Button>
									</div>
								</div>
							)}
						</span>
					</div>
				))}
		</Box>
	);
};

export default ScrollableChat;
