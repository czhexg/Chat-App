import { useNavigate } from "react-router-dom";
import {
    Avatar,
    AvatarBadge,
    Box,
    Button,
    Input,
    Menu,
    MenuButton,
    MenuDivider,
    MenuItem,
    MenuList,
    Spinner,
    Text,
    Tooltip,
    useDisclosure,
    useToast,
} from "@chakra-ui/react";
import {
    Drawer,
    DrawerBody,
    DrawerFooter,
    DrawerHeader,
    DrawerOverlay,
    DrawerContent,
    DrawerCloseButton,
} from "@chakra-ui/react";
import { BellIcon, ChevronDownIcon } from "@chakra-ui/icons";
import React, { useState } from "react";
import { ChatState } from "../../Context/ChatProvider";
import ProfileModal from "./ProfileModal";
import ChatLoading from "./ChatLoading";
import UserListItem from "../UserAvatar/UserListItem";

function SideDrawer() {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const {
        setSelectedChat,
        user,
        chats,
        setChats,
        notification,
        setNotification,
    } = ChatState();

    const navigate = useNavigate();

    const { isOpen, onOpen, onClose } = useDisclosure();
    const toast = useToast();

    function getSenderName(loggedUser, users) {
        return users[0]._id === loggedUser._id ? users[1].name : users[0].name;
    }

    function logoutHandler() {
        sessionStorage.removeItem("userInfo");
        navigate("/");
    }

    function handleSearch() {
        if (!search) {
            toast({
                title: "Please Enter something in search",
                status: "warning",
                duration: 3000,
                isClosable: true,
                position: "top-left",
            });
            return;
        }
        try {
            setLoading(true);

            fetch(`/api/user?search=${search}`, {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            })
                .then((response) => {
                    return response.json();
                })
                .then((data) => {
                    setLoading(false);
                    if (data) {
                        setSearchResult(data);
                    }
                });
        } catch (error) {
            toast({
                title: "Error Occured!",
                description: "Failed to Load the Search Results",
                status: "error",
                duration: 5000,
                isClosable: true,
                position: "bottom-left",
            });
        }
    }

    function accessChat(userId) {
        setLoadingChat(true);

        fetch(`/api/chat`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${user.token}`,
            },
            body: JSON.stringify({
                userId: userId,
            }),
        })
            .then((response) => {
                return response.json();
            })
            .then((data) => {
                console.log(data);
                if (!chats.find((chat) => chat._id === data._id)) {
                    setChats([data, ...chats]);
                }
                setSelectedChat(data);
                setLoadingChat(false);
                onClose();
            })
            .catch((err) => {
                toast({
                    title: "Error fetching the chat",
                    description: err.message,
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                    position: "bottom-left",
                });
            });
    }

    return (
        <>
            <Box
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                background="white"
                width="100%"
                padding="5px 10px"
                borderWidth="5px"
            >
                <Tooltip
                    label="Search Users to chat"
                    hasArrow
                    placement="bottom-end"
                >
                    <Button variant="ghost" onClick={onOpen}>
                        <i class="fa-solid fa-magnifying-glass"></i>
                        <Text display={{ base: "none", md: "flex" }} px="4px">
                            Search User
                        </Text>
                    </Button>
                </Tooltip>
                <Text fontSize="2xl" fontFamily="Inter">
                    WhatsDat
                </Text>
                <Box>
                    <Menu>
                        <MenuButton padding="10px">
                            <Avatar
                                size="xs"
                                bg="white"
                                icon={<BellIcon fontSize="2xl" color="black" />}
                            >
                                {notification.length ? (
                                    <AvatarBadge
                                        boxSize="1.5em"
                                        bg="red"
                                        placement="top-end"
                                    >
                                        {notification.length}
                                    </AvatarBadge>
                                ) : (
                                    <></>
                                )}
                            </Avatar>
                        </MenuButton>
                        <MenuList paddingLeft={3}>
                            {!notification.length && "No new messages"}
                            {notification.map((notif) => {
                                return (
                                    <MenuItem
                                        key={notif._id}
                                        onClick={() => {
                                            setSelectedChat(notif.chat);
                                            setNotification(
                                                notification.filter(
                                                    (n) => n !== notif
                                                )
                                            );
                                        }}
                                    >
                                        {notif.chat.isGroupChat
                                            ? `New message in ${notif.chat.chatName}`
                                            : `New message from ${getSenderName(
                                                  user,
                                                  notif.chat.users
                                              )}`}
                                    </MenuItem>
                                );
                            })}
                        </MenuList>
                    </Menu>
                    <Menu>
                        <MenuButton as={Button} rightIcon={<ChevronDownIcon />}>
                            <Avatar
                                size="sm"
                                cursor="pointer"
                                name={user.name}
                                src={user.picture}
                            />
                        </MenuButton>
                        <MenuList>
                            <ProfileModal user={user}>
                                <MenuItem>My Profile</MenuItem>
                            </ProfileModal>
                            <MenuDivider />
                            <MenuItem onClick={logoutHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </Box>
            </Box>

            <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
                <DrawerOverlay />
                <DrawerContent>
                    <DrawerHeader borderBottomWidth="1px">
                        Search Users
                    </DrawerHeader>
                    <DrawerBody>
                        <Box display="flex" paddingBottom="10px">
                            <Input
                                placeholder="Search by name or email"
                                marginRight="10px"
                                value={search}
                                onChange={(e) => {
                                    setSearch(e.target.value);
                                }}
                            />
                            <Button onClick={handleSearch}>Go</Button>
                        </Box>
                        {loading ? (
                            <ChatLoading />
                        ) : searchResult.length !== 0 ? (
                            searchResult.map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => accessChat(user._id)}
                                />
                            ))
                        ) : (
                            <span>No users found</span>
                        )}
                        {loadingChat && (
                            <Spinner marginLeft="auto" display="flex" />
                        )}
                    </DrawerBody>
                </DrawerContent>
            </Drawer>
        </>
    );
}

export default SideDrawer;
