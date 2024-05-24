import React from 'react'
import { Avatar, Text, HStack } from "@chakra-ui/react"
const Message = ({ text, uri, user = 'other' }) => {
    return (
        <HStack bg={"gray.100"} alignSelf={user === "me" ? "flex-end" : "flex-start"} paddingY={"2"}
            paddingX={user === "me" ? "4" : "2"}
            borderRadius={"base"} >

            {user === "other" && <Avatar src={uri} />}

            <Text>{text}</Text>

            {user === "me" && <Avatar src={uri} />}
        </HStack>
    )
}

export default Message
