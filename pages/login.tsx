import {
    Box,
    Button,
    Input,
    VStack,
    Text,
    Heading,
    useToast
  } from "@chakra-ui/react";
  import Router from "next/router";
  import React, { useState } from "react";
  import { auth, db } from "../config/firebase";
  
  const Login = () => {
    const toast = useToast();
    const [email, setEmail] = useState("");
    const [passowrd, setPassword] = useState("");
  
    const [loading, setLoading] = useState(false);
  
    const onLogin = async () => {
      setLoading(true);
     await db.collection("data-mahasiswa").where("email", "==", email).get().then((v) => {
       if(v.empty) {
        toast({
          description: "Email tidak terdaftar",
          status: "error",
        });
        return;
       }  
       else{
         let emails = ''
         let nims  = ''
         let passwords = ''
         let isLogin = false

         v.forEach((docs) => {
           emails = docs.data().email,
           passwords = docs.data().password
           isLogin = docs.data().isLogin
           nims = docs.data().nim
         })

         if(passowrd === passwords) {
          if(!isLogin) {
            auth
             .createUserWithEmailAndPassword(email, passowrd)
             .then((response) => {
              console.log(response)
             })
           db.doc(`/data-mahasiswa/${nims}`).update({isLogin: true})
           .catch((error) => {
            return { error };
           });
          }else if(isLogin){
            auth.signInWithEmailAndPassword(email, passowrd);
          }
         }
         else{
           toast({
             description:"Password Salah!",
             status:"error",
             
           })
         }
        
       }
     })
     setLoading(false);
    };
  
    return (
      <Box bg="#12B2B3" h={"100vh"}>
        <VStack spacing={10}>
          <Heading
            w={600}
            textAlign={"center"}
            mt={"10vh"}
            color={"white"}
            textTransform={"capitalize"}
          >
            Bimbingan TA/Skripsi Online
          </Heading>
          <VStack
            mt={"30vh"}
            align={"stretch"}
            spacing={5}
            bg={"gray.100"}
            p={10}
            rounded={"xl"}
            shadow={"md"}
          >
            <VStack align={"start"}>
              <Text fontWeight={"bold"}>Email</Text>
              <Input
                type={"email"}
                placeholder="Email"
                borderColor={"black"}
                width={"400px"}
                borderWidth={"2px"}
                onChange={(e) => setEmail(e.target.value)}
                value={email}
              />
            </VStack>
  
            <VStack align={"start"}>
              <Text fontWeight={"bold"}>Password</Text>
              <Input
                type={"password"}
                placeholder="Password"
                width={"400px"}
                borderColor={"black"}
                borderWidth={"2px"}
                value={passowrd}
                onChange={(e) => setPassword(e.target.value)}
              />
            </VStack>
  
            <Button
              mt={10}
              onClick={onLogin}
              isLoading={loading}
              bg="#12B2B3"
              color={"white"}
            >
              Login
            </Button>
          </VStack>
        </VStack>
      </Box>
    );
  };
  
  export default Login;
  