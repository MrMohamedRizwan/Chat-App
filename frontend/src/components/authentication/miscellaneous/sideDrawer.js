import { Avatar, Box, Button, Drawer, DrawerBody, DrawerContent, DrawerHeader, DrawerOverlay, Flex, Input, Menu, MenuButton, MenuDivider, MenuItem, MenuList, Spinner, Text, Tooltip, useDisclosure, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { BellIcon, ChevronDownIcon } from '@chakra-ui/icons'
import { ChatState } from '../../../context/chatProvider';
import ProfileModal from './ProfileModel';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from "axios";
import ChatLoading from '../ChatLoading';
import UserListItem from '../userAvatar/userListItem';
import { API_URL } from '../../../configurations/config';
const SideDrawer = () => {
  const {selectedChat,
    setSelectedChat,
    user,
    setUser,
    notification,
    setNotification,
    chats,
    setChats}=ChatState();
  const toast = useToast();

  const accesschat=async (userId)=>{
    // console.log("Access Chat");
    console.log(userId);

    try {
      setLoadingChat(true);
      const config = {
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
      };
      const { data } = await axios.post(`${API_URL}/api/chat`, { userId }, config);
      console.log(chats,"log ")
      if (!chats || !chats.find) {
        // Handle the case where `chats` is undefined or doesn't have a `find` method
        // For example, you might want to initialize `chats` to an empty array
        setChats([data]);
      } else {
        if (!chats.find(c => c._id === data._id)) {
          setChats([data, ...chats]);
        }}
      setSelectedChat(data);
      setLoadingChat(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error fetching the chat",
        description: error.message,
        status: "error",
        duration: 5000,
        isClosable: true,
        position: "bottom-left",
      });
    }
  }
  const [searchResult,setSearhResult]=useState([]);
  
  const handleSearch=async ()=>{
    if (!search) {
      toast({
        title: "Please Enter something in search",
        status: "warning",
        duration: 5000,
        isClosable: true,
        position: "top-left",
      });
      return;
    }

    try {
      setLoading(true);

      const config = {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      };

      const { data } = await axios.get(`${API_URL}/api/user?search=${search}`, config);
      // console.log(data)

      setLoading(false);
      setSearhResult(data);
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
  const {isOpen,onOpen,onClose}=useDisclosure();

  const [search,setSearh]=useState("")
  const[loadingchat,setLoadingChat]=useState();

  const [loading,setLoading]=useState(false)

  const history=useHistory()
  const logoutHandle= ()=>{
    localStorage.removeItem("userInfo");
    history.push("/");

  }
// console.log("chats");
  return (
    <div>
      {/* <h1 >Rizwan</h1> */}
      <Box d="flex"
        justifyContent="space-between"
        alignItems="center"
        bg="white"
        w="100%"
        p="5px 10px 5px 10px"
        borderWidth="5px"
        className='border-[5px] w-[100%] bg-white flex space-between items-center p-[5px 10px 5px 10px]'
        
        >
        <Tooltip label="Search Users to chat" hasArrow placement='bottom-end' >
          <Button variant="ghost" onClick={onOpen}>
            <i className="fas fa-search"> </i>
            <Text d={{base:'none',md:'flex'}} px="4">Search User</Text>

          </Button>
        </Tooltip>
        <Text fontSize='2xl' fontFamily='Work sans'>
          Chit-Chat
        </Text>
        <div>
          <Menu>
            <MenuButton p={1}>
              < BellIcon/>
            </MenuButton>
            {/* <MenuList></MenuList> */}
          </Menu>
          <Menu>
            <MenuButton as={Button} rightIcon={<ChevronDownIcon/>}>
              <Avatar size='sm' cursor='pointer' name={user.name} src={user.pic} />
            </MenuButton>
            <MenuList>
              <ProfileModal user={user}>

              <MenuItem>My Profile</MenuItem>
              </ProfileModal>
              <MenuDivider/>
              <MenuItem onClick={logoutHandle}>Logout</MenuItem>

            </MenuList>
          </Menu>
        </div>


      </Box>


      <Drawer placement="left" onClose={onClose} isOpen={isOpen}>
      <DrawerOverlay/>
      <DrawerContent>
        <DrawerHeader borderBottomWidth='1px'>Search Users </DrawerHeader>
        <DrawerBody>
        <Box d='flex' pb={2} className='flex'>
          <Input
          placeholder='Search '
          mr={2}
          value={search}
          onChange={(e)=>setSearh(e.target.value)}
          />
          <Button onClick={handleSearch}>Go</Button>

        </Box>

        {loading?(<ChatLoading/>
        ):(
          searchResult?.map((userr)=>(
            <UserListItem
            key={userr._id}
            user={userr}
            handleFunction={()=>accesschat(userr._id)}
            />
        )))
        }
        <div className='flex flex-col items-center'>

        {loadingchat &&<Spinner ml="" className=' ' d=''/>}
        
        </div>
      </DrawerBody>
      </DrawerContent>
      
      </Drawer>
    </div>
  )
}


export default SideDrawer
