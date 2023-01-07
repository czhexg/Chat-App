import React, { useState } from "react";
import {
    useDisclosure,
    Modal,
    ModalOverlay,
    ModalContent,
    ModalHeader,
    ModalFooter,
    ModalBody,
    ModalCloseButton,
    Button,
    useToast,
    FormControl,
    Input,
    Box,
} from "@chakra-ui/react";
import { ChatState } from "../../Context/ChatProvider";
import UserListItem from "../UserAvatar/UserListItem";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";

function GroupChatModal({ children }) {
    const { isOpen, onOpen, onClose } = useDisclosure();
    const [groupChatName, setGroupChatName] = useState();
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const toast = useToast();

    const { user, chats, setChats } = ChatState();

    function handleGroup(userToAdd) {
        if (selectedUsers.includes(userToAdd)) {
            toast({
                title: "User already added",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        setSelectedUsers([...selectedUsers, userToAdd]);
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
            .then((data) => {
                setLoading(false);
                setSearchResult(data);
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

    function handleDelete(delUser) {
        setSelectedUsers(
            selectedUsers.filter((sel) => sel._id !== delUser._id)
        );
    }

    function handleSubmit() {
        if (!groupChatName || selectedUsers.length === 0) {
            toast({
                title: "Please fill all the feilds",
                status: "warning",
                duration: 5000,
                isClosable: true,
                position: "top",
            });
            return;
        }

        fetch(`/api/chat/group`, {
            method: "POST",
            headers: {
                Authorization: `Bearer ${user.token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                name: groupChatName,
                users: selectedUsers.map((user) => user._id),
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                setChats([data, ...chats]);
                onClose();
                toast({
                    title: "New Group Chat Created!",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            })
            .catch((error) => {
                toast({
                    title: "Failed to Create the Chat!",
                    description: error.response.data,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom",
                });
            });
    }

    return (
        <>
            <span onClick={onOpen}>{children}</span>

            <Modal isOpen={isOpen} onClose={onClose}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader
                        fontSize="35px"
                        fontFamily="Inter"
                        display="flex"
                        justifyContent="center"
                    >
                        Create Group Chat
                    </ModalHeader>
                    <ModalCloseButton />
                    <ModalBody
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                    >
                        <FormControl>
                            <Input
                                placeholder="Chat Name"
                                marginBottom={3}
                                onChange={(e) =>
                                    setGroupChatName(e.target.value)
                                }
                            />
                            <Input
                                placeholder="Add Users"
                                marginBottom={1}
                                onChange={(e) => handleSearch(e.target.value)}
                            />
                        </FormControl>
                        <Box width="100%" display="flex" flexWrap="wrap">
                            {selectedUsers.map((user) => (
                                <UserBadgeItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleDelete(user)}
                                />
                            ))}
                        </Box>

                        {loading ? (
                            <div>loading</div>
                        ) : (
                            searchResult
                                .slice(0, 4)
                                .map((user) => (
                                    <UserListItem
                                        key={user._id}
                                        user={user}
                                        handleFunction={() => handleGroup(user)}
                                    />
                                ))
                        )}
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme="blue" onClick={handleSubmit}>
                            Create Chat
                        </Button>
                    </ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}

export default GroupChatModal;
