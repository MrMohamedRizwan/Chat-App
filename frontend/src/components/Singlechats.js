import { FormControl } from "@chakra-ui/form-control";
import { Input } from "@chakra-ui/input";
import { Box, Text } from "@chakra-ui/layout";
// import "./styles.css";
import { IconButton, Spinner, useToast } from "@chakra-ui/react";
import { getSender, getSenderFull } from "../config/ChatLogics";
import { useEffect, useRef, useState } from "react";
import axios from "axios";
import { ArrowBackIcon } from "@chakra-ui/icons";
import "../App.css";
import ScrollableChat from "./ScrollableChat";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";

import io from "socket.io-client";
import UpdateGroupChatModal from "../components/authentication/miscellaneous/UpdateGroupChatModal";
import { ChatState } from "../context/chatProvider";
import ProfileModal from "./authentication/miscellaneous/ProfileModel";
import ScrollableDiv from "./authentication/miscellaneous/Scrollablediv";
import { API_URL } from "../configurations/config";
const ENDPOINT = API_URL;
var socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(false);
	const [newMessage, setNewMessage] = useState("");
	const [socketConnected, setSocketConnected] = useState(false);
	const [typing, setTyping] = useState(false);
	const [istyping, setIsTyping] = useState(false);
	const toast = useToast();

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData,
		rendererSettings: {
			preserveAspectRatio: "xMidYMid slice",
		},
	};
	const { selectedChat, setSelectedChat, user, notification, setNotification } =
		ChatState();

	const fetchMessages = async () => {
		if (!selectedChat) return;

		try {
			const config = {
				headers: {
					Authorization: `Bearer ${user.token}`,
				},
			};

			setLoading(true);

			const { data } = await axios.get(
				`${API_URL}/api/message/${selectedChat._id}`,
				config,
			);
			setMessages(data);
			setLoading(false);

			socket.emit("join chat", selectedChat._id);
		} catch (error) {
			toast({
				title: "Error Occured!",
				description: "Failed to Load the Messages",
				status: "error",
				duration: 5000,
				isClosable: true,
				position: "bottom",
			});
		}
	};

	const sendMessage = async (event) => {
		if (event.key === "Enter" && newMessage) {
			socket.emit("stop typing", selectedChat._id);
			try {
				const config = {
					headers: {
						"Content-type": "application/json",
						Authorization: `Bearer ${user.token}`,
					},
				};
				setNewMessage("");
				const { data } = await axios.post(
					`${API_URL}/api/message`,
					{
						content: newMessage,
						chatId: selectedChat,
					},
					config,
				);
				socket.emit("new message", data);
				setMessages([...messages, data]);
			} catch (error) {
				toast({
					title: "Error Occured!",
					description: "Failed to send the Message",
					status: "error",
					duration: 5000,
					isClosable: true,
					position: "bottom",
				});
			}
		}
	};

	const [OnlineUsers, setOnlineUsers] = useState([]);
	useEffect(() => {
		socket = io(ENDPOINT);
		socket.emit("setup", user);
		socket.on("connected", () => setSocketConnected(true));
		socket.on("typing", () => setIsTyping(true));
		socket.on("stop typing", () => setIsTyping(false));
		socket.on("online-users", (users) => {
			setOnlineUsers(users);
		});

		socket.on("user-online", (userId) => {
			setOnlineUsers((prev) => {
				if (!prev.includes(userId)) {
					return [...prev, userId];
				}
				return prev;
			});
		});

		socket.on("user-offline", (userId) => {
			setOnlineUsers((prev) => prev.filter((id) => id !== userId));
		});

		return () => {
			socket.disconnect();
		};
	}, [ENDPOINT, user]);

	useEffect(() => {
		fetchMessages();

		selectedChatCompare = selectedChat;
		// eslint-disable-next-line
	}, [selectedChat]);

	useEffect(() => {
		socket.on("message recieved", (newMessageRecieved) => {
			if (
				!selectedChatCompare || // if chat is not selected or doesn't match current chat
				selectedChatCompare._id !== newMessageRecieved.chat._id
			) {
				if (!notification.includes(newMessageRecieved)) {
					setNotification([newMessageRecieved, ...notification]);
					setFetchAgain(!fetchAgain);
				}
			} else {
				setMessages([...messages, newMessageRecieved]);
			}
		});
	});

	const typingHandler = (e) => {
		setNewMessage(e.target.value);

		if (!socketConnected) return;

		if (!typing) {
			setTyping(true);
			socket.emit("typing", selectedChat._id);
		}
		let lastTypingTime = new Date().getTime();
		var timerLength = 3000;
		setTimeout(() => {
			var timeNow = new Date().getTime();
			var timeDiff = timeNow - lastTypingTime;
			if (timeDiff >= timerLength && typing) {
				socket.emit("stop typing", selectedChat._id);
				setTyping(false);
			}
		}, timerLength);
	};
	const AlwaysScrollToBottom = () => {
		const elementRef = useRef();
		useEffect(() => elementRef.current.scrollIntoView());
		return <div ref={elementRef} />;
	};
	var useronlinestatus;

	return (
		<>
			{selectedChat ? (
				<>
					<Text
						fontSize={{ base: "28px", md: "30px" }}
						pb={3}
						px={2}
						w='100%'
						fontFamily='Work sans'
						className='flex items-center '
						justifyContent={{ base: "space-between" }}
						alignItems='center'>
						<IconButton
							d={{ base: "flex", md: "none" }}
							icon={<ArrowBackIcon />}
							onClick={() => setSelectedChat("")}
						/>
						{messages &&
							(!selectedChat.isGroupChat ? (
								<>
									{(useronlinestatus = getSender(user, selectedChat.users))}
									{OnlineUsers.includes(selectedChat.users[1]?._id) && (
										<div className='green absolute lg:mx-[36%] mt-[2%] md:mx-[36%] sm:mx-[53%] mx-[52%] '>
											online
										</div>
									)}

									<ProfileModal
										user={getSenderFull(user, selectedChat.users)}
									/>
								</>
							) : (
								<>
									{selectedChat.chatName.toUpperCase()}
									<UpdateGroupChatModal
										fetchMessages={fetchMessages}
										fetchAgain={fetchAgain}
										setFetchAgain={setFetchAgain}
									/>
								</>
							))}
					</Text>
					<Box
						d='flex'
						flexDir='column'
						justifyContent='flex-end'
						p={3}
						bg='#E8E8E8'
						className='flex flex-col justify-end  w-[100%] h-[90%]'
						borderRadius='lg'
						overflowY='hidden'>
						{loading ? (
							<Spinner
								size='xl'
								w={20}
								h={20}
								alignSelf='center'
								margin='auto'
							/>
						) : (
							<div
								className='messages'
								style={{
									display: "flex",
									flexDirection: "column",
									overflowY: "scroll",
									scrollbarWidth: "none",
								}}>
								<div style={{ flexgrow: "1", overflowY: "scroll" }}>
									<ScrollableChat messages={messages} />
									<AlwaysScrollToBottom />
								</div>
							</div>
						)}

						<FormControl
							onKeyDown={sendMessage}
							id='first-name'
							isRequired
							mt={3}>
							{istyping ? (
								<div>
									<Lottie
										options={defaultOptions}
										// height={50}
										width={70}
										style={{ marginBottom: 15, marginLeft: 0 }}
									/>
								</div>
							) : (
								<></>
							)}
							<Input
								variant='filled'
								bg='#E0E0E0'
								placeholder='Enter a message..'
								value={newMessage}
								onChange={typingHandler}
							/>
						</FormControl>
					</Box>
				</>
			) : (
				// to get socket.io on same page
				<Box
					d='flex'
					alignItems='center'
					justifyContent='center'
					className=' flex  items-center h-[100%] '>
					<Text fontSize='3xl' pb={3} fontFamily='Work sans'>
						Click on a user to start chatting
					</Text>
				</Box>
			)}
		</>
	);
};

export default SingleChat;
