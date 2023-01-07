import { CloseIcon } from "@chakra-ui/icons";
import { Badge } from "@chakra-ui/react";
import React from "react";

function UserBadgeItem({ user, handleFunction }) {
    return (
        <Badge
            paddingX={2}
            paddingY={1}
            borderRadius="lg"
            margin={1}
            marginBottom={2}
            variant="solid"
            fontSize={12}
            colorScheme="green"
            cursor="pointer"
            textTransform="none"
            onClick={handleFunction}
        >
            {user.name}
            <CloseIcon paddingLeft={1} />
        </Badge>
    );
}

export default UserBadgeItem;
