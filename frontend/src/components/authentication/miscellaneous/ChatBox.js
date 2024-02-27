import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../../context/chatProvider';

const ChatBox = () => {
  const {selectedChat}=ChatState();
  return (
    <Box d={{base:selectedChat?"flex":"none", md:"flex"}}
    className={{base:selectedChat?"flex":"none", md:"flex" } }
    style={{bg:'black'}}
    alignItems="center"
    flexDir='column'
    p={3}
    bg='white'
    w={{base:"100%",md:"68%"}}
    borderRadius="lg"
    borderWidth="1px"

    >

      Single
    </Box>
  )
}

export default ChatBox
