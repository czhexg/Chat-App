import { ArrowBackIcon } from "@chakra-ui/icons";
import {
    Box,
    FormControl,
    IconButton,
    Input,
    Spinner,
    Text,
    useToast,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import ScrollableChat from "./ScrollableChat";
import UpdateGroupChatModal from "./UpdateGroupChatModal";

import io from "socket.io-client";

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

function SingleChat({ fetchAgain, setFetchAgain }) {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [isTyping, setIsTyping] = useState(false);

    const toast = useToast();

    const { user, selectedChat, setSelectedChat } = ChatState();

    function getSenderName(loggedUser, users) {
        return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    }

    function getSender(loggedUser, users) {
        return users[0]._id === loggedUser._id ? users[1] : users[0];
    }

    function fetchAllMessages() {
        if (!selectedChat) {
            return;
        }

        fetch(`/api/message/${selectedChat._id}`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((fetchedMessages) => {
                setMessages(fetchedMessages);
                setLoading(false);

                socket.emit("join chat", selectedChat._id);
            })
            .catch((err) => {
                toast({
                    title: "Error Occured!",
                    description: "Failed to Load the Search Results",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                });
            });
    }

    function sendMessage(event) {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            setNewMessage("");
            fetch("/api/message/send", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    content: newMessage,
                    chatId: selectedChat._id,
                }),
            })
                .then((response) => {
                    return response.json();
                })
                .then((sentMessage) => {
                    socket.emit("new message", sentMessage);
                    setMessages([...messages, sentMessage]);
                })
                .catch((err) => {
                    toast({
                        title: "Error Occured!",
                        description: "Failed to Load the Search Results",
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom-left",
                    });
                });
        }
    }

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    }, []);

    useEffect(() => {
        fetchAllMessages();

        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                // give notification
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    });

    function typingHandler(event) {
        setNewMessage(event.target.value);
        if (!socketConnected) {
            return;
        }

        let temp_typing = false;
        if (!typing) {
            setTyping(true);
            temp_typing = true;
            socket.emit("typing", selectedChat._id);
        }

        let lastTypingTime = new Date().getTime();
        let timerLength = 3000;
        setTimeout(() => {
            let timeNow = new Date().getTime();
            let timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && temp_typing) {
                console.log("stop typing");
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    }

    return (
        <>
            {selectedChat ? (
                <>
                    <Text
                        fontSize={{ base: "28px", md: "30px" }}
                        paddingBottom={3}
                        paddingX={2}
                        width="100%"
                        fontFamily="Inter"
                        display="flex"
                        justifyContent={{ base: "space-between" }}
                        alignItems="center"
                    >
                        <IconButton
                            display={{ base: "flex", md: "none" }}
                            icon={<ArrowBackIcon />}
                            onClick={() => setSelectedChat("")}
                        />
                        {!selectedChat.isGroupChat ? (
                            <>
                                {getSenderName(user, selectedChat.users)}
                                <ProfileModal
                                    user={getSender(user, selectedChat.users)}
                                />
                            </>
                        ) : (
                            <>
                                {selectedChat.chatName}
                                <UpdateGroupChatModal
                                    fetchAgain={fetchAgain}
                                    setFetchAgain={setFetchAgain}
                                />
                            </>
                        )}
                    </Text>
                    <Box
                        display="flex"
                        flexDirection="column"
                        justifyContent="flex-end"
                        padding={3}
                        backgroundColor="#EDEDED"
                        width="100%"
                        height="100%"
                        borderRadius="lg"
                        overflowY="hidden"
                    >
                        {loading ? (
                            <Spinner
                                size="xl"
                                width={20}
                                height={20}
                                alignSelf="center"
                                margin="auto"
                            />
                        ) : (
                            <Box
                                display="flex"
                                flexDirection="column"
                                overflowY="scroll"
                            >
                                <ScrollableChat messages={messages} />
                            </Box>
                        )}

                        <FormControl
                            onKeyDown={sendMessage}
                            isRequired
                            marginTop={3}
                        >
                            {isTyping ? <div>...</div> : <></>}
                            <Input
                                variant="filled"
                                backgroundColor="#E0E0E0"
                                placeholder="Enter a message..."
                                onChange={typingHandler}
                                value={newMessage}
                            />
                        </FormControl>
                    </Box>
                </>
            ) : (
                <Box
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                >
                    <Text fontSize="3xl" paddingBottom={3} fontFamily="Inter">
                        Click on a user to start chatting
                    </Text>
                </Box>
            )}
        </>
    );
}

export default SingleChat;
