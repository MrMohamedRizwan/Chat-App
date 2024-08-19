import { Button, FormControl, FormLabel, Input, VStack, createMultiStyleConfigHelpers, useToast } from '@chakra-ui/react';
import React, { useState } from 'react'
import { useHistory } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../../configurations/config';
const Signup = () => {
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [confirmPassword,setconfirmPassword] = useState('')
  const [pic,setPic] = useState('dummypixc')
  const toast=useToast()
  const[Loading,setloading] = useState(false)
  const history = useHistory()
  // const postDetails=(pics)=>{
  //   setloading(true)
  //   if(pics===undefined){
  //     toast({
  //       title: "Please select a picture",
  //       status: "warning",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "bottom"
  //     })
  //     return;
  //   }
  //   if(pics.type==="image/png"||pics.type==="image/jpeg")
  //   {
  //     const data=new FormData()
  //     data.append("file",pics);
  //     data.append("upload_preset","chat-app")
  //     data.append("cloud-name","drnz56vj3")
  //     fetch("https://api.cloudinary.com/v1_1/drnz56vj3",{
  //       method:"post",
  //       body:data,
  //     }).then((res)=>res.json())
  //     .then(data=>{
  //       setPic(data.url.toString());
  //       console.log(data.url.toString())
  //       setloading(false);
  //     })
  //     .catch(err=>
  //     {
  //       console.log("error",err);
  //     })
  //   }
  //   else{
  //     toast({
  //       title: "Please select a picture",
  //       status: "warning",
  //       duration: 3000,
  //       isClosable: true,
  //       position: "bottom"
  //     })
  //     setloading(false);
  //     return;
  //   }





    const postDetails = (pics) => {
      console.log("cALLED")
      setPic("fygthj")
      // setloading(true);
      // if (pics === undefined) {
      //   toast({
      //     title: "Please Select an Image!",
      //     status: "warning",
      //     duration: 5000,
      //     isClosable: true,
      //     position: "bottom",
      //   });
      //   return;
      // }
      // console.log(pics,"pr");
      // if (pics.type === "image/jpeg" || pics.type === "image/png") {
      //   const data = new FormData();
      //   data.append("file", pics);
      //   data.append("upload_preset", "chat-app");
      //        data.append("cloud-name","drnz56vj3")
      //   fetch("https://api.cloudinary.com/v1_1/drnz56vj3/image/upload", {
      //     method: "post",
      //     body: data,
      //   })
      //     .then((res) => res.json())
      //     .then((data) => {
      //       setPic(data.url.toString());
      //       console.log(data.url.toString());
      //       setloading(false);
      //     })
      //     .catch((err) => {
      //       console.log(err);
      //       setloading(false);
      //     });
      // } else {
      //   toast({
      //     title: "Please Select an Image!",
      //     status: "warning",
      //     duration: 5000,
      //     isClosable: true,
      //     position: "bottom",
      //   });
      //   setloading(false);
      //   return;
      // }
    };
  












  
    const submitHandler = async () => {
      setloading(true);
      if (!name || !email || !password || !confirmPassword) {
        toast({
          title: "Please Fill all the Feilds",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setloading(false);
        return;
      }
      if (password !== confirmPassword) {
        toast({
          title: "Passwords Do Not Match",
          status: "warning",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        return;
      }
      console.log(name, email, password, pic,"details");
      try {
        const config = {
          headers: {
            "Content-type": "application/json",
          },
        };
        const { data } = await axios.post(
          `${API_URL}/api/user`,
          {
            name,
            email,
            password,
            pic,
          },
          config
        );
        console.log(data);
        toast({
          title: "Registration Successful",
          status: "success",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        localStorage.setItem("userInfo", JSON.stringify(data));
        setloading(false);
        history.push("/chats");
      } catch (error) {
        toast({
          title: "Error Occured!",
          description: error.response.data.message,
          status: "error",
          duration: 5000,
          isClosable: true,
          position: "bottom",
        });
        setloading(false);
      }
    };
  return (
    <VStack spacing={'5px'} >
      <FormControl id='first-name' isRequired>
        <FormLabel>
          Name
          <Input placeholder='Enter your Name' onChange={(e)=>setName(e.target.value)}/>
        </FormLabel>
      </FormControl>
      <FormControl id='email' isRequired>
        <FormLabel>
          Email
          <Input placeholder='Enter your Email' onChange={(e)=>setEmail(e.target.value)}/>
        </FormLabel>
      </FormControl>

      <FormControl id='password' isRequired>
        <FormLabel>
          Password
          <Input type='password' placeholder='Enter your Password' onChange={(e)=>setPassword(e.target.value)}/>
        </FormLabel>
      </FormControl>

      <FormControl id='ConfirmPwd' isRequired>
        <FormLabel>
          Password
          <Input type='password' placeholder='Re-enter your Password' onChange={(e)=>setconfirmPassword(e.target.value)}/>
        </FormLabel>
      </FormControl>
      {/* <FormControl id="pic">
        <FormLabel>Upload your Picture</FormLabel>
        <Input
          type="file"
          p={1.5}
          accept="image/*"
          onChange={(e) => postDetails(e.target.files[0])}
        />
      </FormControl> */}
      <Button
        colorScheme="blue"
        width="100%"
        style={{ marginTop: 15 }}
        onClick={submitHandler}
        isLoading={Loading}
      >
        Sign Up
      </Button>
    </VStack>

  )
}

export default Signup;
