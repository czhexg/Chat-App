import React, { useState } from "react";

import {
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    useDisclosure,
    IconButton,
    Button,
    useToast,
    Box,
    FormControl,
    Input,
    Spinner,
} from "@chakra-ui/react";
import { ViewIcon } from "@chakra-ui/icons";
import { ChatState } from "../../Context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";

function UpdateGroupChatModal({ fetchAgain, setFetchAgain }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const { selectedChat, setSelectedChat, user } = ChatState();

    const [groupChatName, setGroupChatName] = useState(selectedChat.chatName);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameLoading, setRenameLoading] = useState(false);

    const toast = useToast();

    function handleAddUser(userToAdd) {
        if (selectedChat.groupAdmin._id !== user._id) {
            toast({
                title: "Only admins can add someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        setLoading(true);

        fetch(`/api/chat/groupadd`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chatId: selectedChat._id,
                userId: userToAdd._id,
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((updatedChat) => {
                setSelectedChat(updatedChat);
                setFetchAgain(!fetchAgain);
                setLoading(false);
            })
            .catch((error) => {
                toast({
                    title: "Error Occured!",
                    description: error.response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                setLoading(false);
            });
        setGroupChatName("");
    }

    function handleRemove(userToRemove) {
        if (
            selectedChat.groupAdmin._id !== user._id &&
            userToRemove._id !== user._id
        ) {
            toast({
                title: "Only admins can remove someone!",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom",
            });
            return;
        }

        setLoading(true);

        fetch(`/api/chat/groupremove`, {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                chatId: selectedChat._id,
                userId: userToRemove._id,
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((updatedChat) => {
                userToRemove._id === user._id
                    ? setSelectedChat()
                    : setSelectedChat(updatedChat);
                setFetchAgain(!fetchAgain);
                setLoading(false);
            })
            .catch((error) => {
                toast({
                    title: "Error Occured!",
                    description: error.response.data.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
                setLoading(false);
            });
        setGroupChatName("");
    }

    function handleRename() {
        if (!groupChatName) {
            return;
        } else {
            setRenameLoading(true);
            fetch(`/api/chat/rename`, {
                method: "PATCH",
                headers: {
                    Authorization: `Bearer ${user.token}`,
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                }),
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setSelectedChat(data);
                    setFetchAgain(!fetchAgain);
                    setRenameLoading(false);
                })
                .catch((error) => {
                    toast({
                        title: "Error Occured!",
                        description: error.response.data.message,
                        status: "error",
                        duration: 5000,
                        isClosable: true,
                        position: "bottom",
                    });
                    setRenameLoading(false);
                    setGroupChatName("");
                });
        }
    }

    function handleSearch(query) {
        if (!query) {
            return;
        }
        setSearch(query);
        setLoading(true);

        fetch(`/api/user?search=${query}`, {
            headers: {
                Authorization: `Bearer ${user.token}`,
            },
        })
            .then((response) => {
                return response.json();
            })
            .then((foundUsers) => {
                setLoading(false);
                foundUsers = foundUsers.filter((foundUser) => {
                    let ifExist = selectedChat.users.find(
                        (user) => user._id === foundUser._id
                    );
                    if (ifExist) {
                        return false;
                    }
                    return true;
                });
                setSearchResult(foundUsers);
            })
            .catch((error) => {
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

    return (
        <>
            <IconButton
                display={{ base: "flex" }}
                icon={<ViewIcon />}
                onClick={onOpen}
            />

            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Inter"
                        display="flex"
                        justifyContent="center"
                    >
                        {selectedChat.chatName}
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <Box
                            width="100%"
                            display="flex"
                            flexWrap="wrap"
                            paddingBottom={3}
                        >
                            {selectedChat.users.map((user) => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleRemove(user)}
                                />
                            ))}
                        </Box>
                        <FormControl display="flex">
                            <Input
                                placeholder="Chat Name"
                                marginBottom={3}
                                value={groupChatName}
                                onChange={(e) =>
                                    setGroupChatName(e.target.value)
                                }
                            />
                            <Button
                                variant="solid"
                                colorScheme="teal"
                                marginLeft={1}
                                isLoading={renameLoading}
                                onClick={handleRename}
                            >
                                Update
                            </Button>
                        </FormControl>
                        <FormControl>
                            <Input
                                placeholder="Add User to group"
                                marginBottom={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>

                        {loading ? (
                            <Spinner size="lg" />
                        ) : (
                            searchResult
                                .slice(0, 4)
                                .map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() =>
                                            handleAddUser(user)
                                        }
                                    />
                                ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button
                            onClick={() => handleRemove(user)}
                            colorScheme="red"
                        >
                            Leave Group
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default UpdateGroupChatModal;
