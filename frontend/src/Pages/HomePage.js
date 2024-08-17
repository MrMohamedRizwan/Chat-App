import { Box, Container, Text, Tabs,TabList,TabPanel, TabPanels ,Tab} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import Login from '../components/authentication/Login'
import Signup from '../components/authentication/signup'
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min'

const HomePage = () => {

  const history=useHistory(); 
  useEffect(()=>{
    const user=JSON.parse(localStorage.getItem("userInfo"))
    console.log("Home Page user",user)
    if(user)
    {
        history.push('/chats')
    }
},[history]);
// console.log(history)

  console.log("Home")
  return (
    <Container maxW='xl' centerContent>
      <Box
       d="flex"
       justifyContent="center"
       p={3}
       bg={'#2C6487'}
       w="100%"
       m="40px 0 15px 0"
       borderRadius="lg"
       borderWidth="1px"      
      >
        <Text fontSize="4xl" fontFamily="Work sans" color="#ADD8F7" align="center">Welcome to Chit-Chat</Text>
      </Box >
      <Box
      backgroundColor={"#F5F5F5"}
       d="flex"
       justifyContent="center"
       p={4}
       bg={'white'}
       w="100%"
       m="15px 0 15px 0"
       borderRadius="lg"
       borderWidth="1px"
       color="black">
      <Tabs variant='soft-rounded'>
  <TabList>
    <Tab width="50%">Login</Tab>
    <Tab width="50%">SignUp</Tab>
  </TabList>
  <TabPanels>
    <TabPanel>
      <Login/>
    </TabPanel>
    <TabPanel>
      <Signup/>
    </TabPanel>
  </TabPanels>
</Tabs>

      </Box>
    </Container>
  )
}

export default HomePage
