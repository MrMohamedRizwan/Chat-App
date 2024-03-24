import { Box } from '@chakra-ui/react'
import React from 'react'
import { ChatState } from '../../../context/chatProvider';
import Singlechats from '../../Singlechats';

const ChatBox = ({fetchAgain,setfetchAgain}) => {
  const {selectedChat}=ChatState();
  return (
    
    <Box d={{base:selectedChat?"flex":"none", md:"flex"}}
    className={`flex ${selectedChat ? 'md:flex' : 'flex'}`}
    
    style={{bg:'black'}}
    alignItems="center"
    flexDir='column'
    p={3}
    bg='white'
    w={{base:"100%",md:"68%"}}
    borderRadius="lg"
    borderWidth="1px"

    >
      <div className='text-center flex-col  w-[100%] h-[100%] '>
      
      <Singlechats fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}/>
      

      </div>
    </Box>
    
  )
}

export default ChatBox
