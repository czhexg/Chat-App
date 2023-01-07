import React, { createContext, useState, useContext, useEffect } from "react";

import { useNavigate } from "react-router-dom";

const ChatContext = createContext();

function ChatProvider({ children }) {
    const [user, setUser] = useState();
    const [selectedChat, setSelectedChat] = useState();
    const [chats, setChats] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));

        if (!userInfo) {
            navigate("/");
        } else {
            setUser(userInfo);
        }
    }, []);

    return (
        <ChatContext.Provider
            value={{
                user,
                setUser,
                selectedChat,
                setSelectedChat,
                chats,
                setChats,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
}

function ChatState() {
    return useContext(ChatContext);
}

export { ChatProvider as default, ChatState };
