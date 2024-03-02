import React, { useState } from 'react'
import { ChatState } from '../context/chatProvider'

const Singlechats = ({fetchAgain,setfetchAgain}) => {
  const {selectedChat,
    setSelectedChat,
    user,
    setUser,
    notification,
    setNotification,
    chats,
    setChats}=ChatState();
  return (
    <>
    {selectedChat?(
      <></>
    ):(
      <></>
    )
    }
    </>
  )
}

export default Singlechats
