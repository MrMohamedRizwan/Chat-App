import React, { useEffect } from 'react'
import axios from 'axios';
import  { useState } from 'react';
import { ChatState } from '../context/chatProvider';
import { Box } from '@chakra-ui/react';
import ChatBox from '../components/authentication/miscellaneous/ChatBox';
import MyChats from '../components/authentication/miscellaneous/myChats';
import SideDrawer from '../components/authentication/miscellaneous/sideDrawer';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

const ChatPage = () => {
    const{user}=ChatState();
    console.log(user)
    // console.log("ChatPage",user)
    const [fetchAgain, setfetchAgain] = useState(false);
//   const history=useHistory();

//     useEffect(()=>{
//         // const user=JSON.parse(localStorage.getItem("userInfo"))
//         console.log("Chat page user",user)
//         if(!user)
//         {
//             history.push('/')
//         }
//     },[history]);
    return (
    <>
        {/* {JSON.stringify(user)} */}

        <div style={{width:"100%"}}>
            
            {user && <SideDrawer/>}
            {/* <SideDrawer/> */}
            <Box d="flex" className='flex' justifyContent="space-between" w='100%' h='91.5vh' p='10px'>
            {user && (<MyChats fetchAgain={fetchAgain} />)}
            {user && (<ChatBox fetchAgain={fetchAgain} setfetchAgain={setfetchAgain}/>)}
            </Box>
        </div>
    </>

    )
}

export default ChatPage
