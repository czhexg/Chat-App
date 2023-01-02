import React, { useState, useEffect } from "react";

function Chats() {
    const [chats, setChats] = useState([]);

    useEffect(() => {
        fetch("/api/chats")
            .then((response) => {
                // if (response.status === 403) {
                //     navigate("/login");
                // }
                // try {
                //     return response.json();
                // } catch (error) {
                //     return [];
                // }
                return response.json();
            })
            .then((fetchChats) => {
                console.log(fetchChats);
                setChats(fetchChats);
            })
            .catch((err) => {
                console.log(err);
            });
    }, []);

    console.log(chats);

    return chats.map((chat) => {
        return <div key={chat._id}>{chat.chatName}</div>;
    });
}

export default Chats;
