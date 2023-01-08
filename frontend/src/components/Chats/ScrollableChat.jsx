import { Avatar, Box, Tooltip } from "@chakra-ui/react";
import React, { useEffect, useRef } from "react";
import { ChatState } from "../../Context/ChatProvider";

function ScrollableChat({ messages }) {
    console.log(messages);
    const { user } = ChatState();

    function isSameSender(messages, message, index, userId) {
        return (
            index < messages.length - 1 &&
            (messages[index + 1].sender._id !== message.sender._id ||
                messages[index + 1].sender._id === undefined) &&
            messages[index].sender._id !== userId
        );
    }

    function isLastMessage(messages, i, userId) {
        return (
            i === messages.length - 1 &&
            messages[messages.length - 1].sender._id !== userId &&
            messages[messages.length - 1].sender._id
        );
    }

    function isSameSenderMargin(messages, message, index, userId) {
        if (
            index < messages.length - 1 &&
            messages[index + 1].sender._id === message.sender._id &&
            messages[index].sender._id !== userId
        )
            return 33;
        else if (
            (index < messages.length - 1 &&
                messages[index + 1].sender._id !== message.sender._id &&
                messages[index].sender._id !== userId) ||
            (index === messages.length - 1 &&
                messages[index].sender._id !== userId)
        )
            return 0;
        else return "auto";
    }

    function isSameUser(messages, message, index) {
        return (
            index > 0 && messages[index - 1].sender._id === message.sender._id
        );
    }

    const AlwaysScrollToBottom = () => {
        const elementRef = useRef();
        useEffect(() => elementRef.current.scrollIntoView());
        return <div ref={elementRef} />;
    };

    return (
        <div>
            {messages &&
                messages.map((message, index) => {
                    return (
                        <Box display="flex" key={message._id}>
                            {(isSameSender(
                                messages,
                                message,
                                index,
                                user._id
                            ) ||
                                isLastMessage(messages, index, user._id)) && (
                                <Tooltip
                                    label={message.sender.name}
                                    placement="bottom-start"
                                    hasArrow
                                >
                                    <Avatar
                                        marginTop={2}
                                        marginRight={1}
                                        size="sm"
                                        cursor="pointer"
                                        name={message.sender.name}
                                        src={message.sender.picture}
                                    />
                                </Tooltip>
                            )}
                            <span
                                style={{
                                    backgroundColor: `${
                                        message.sender._id === user._id
                                            ? "#BEE3F8"
                                            : "#B9F5D0"
                                    }`,
                                    borderRadius: "20px",
                                    padding: "5px 15px",
                                    maxWidth: "75%",
                                    marginLeft: isSameSenderMargin(
                                        messages,
                                        message,
                                        index,
                                        user._id
                                    ),
                                    marginTop: isSameUser(
                                        messages,
                                        message,
                                        index,
                                        user.id
                                    )
                                        ? 3
                                        : 10,
                                }}
                            >
                                {message.content}
                            </span>
                            <AlwaysScrollToBottom />
                        </Box>
                    );
                })}
        </div>
    );
}

export default ScrollableChat;
