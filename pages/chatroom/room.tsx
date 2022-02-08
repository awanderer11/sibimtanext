import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { Container, Button, useToast, Box, HStack, Avatar, VStack } from "@chakra-ui/react";
import { InputWihtText } from "../../component/InputText";

const Room = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<any[]>([]);
  const [valMessage, setValMessage] = useState("")
 
  useEffect(() => {
    async function fetch() {
      // db.collection("chatRoom").doc("123456_12345").collection("chat").onSnapshot((docs) => {
      //   const data: any[] = [];
      //   docs.forEach((it) => {
      //     data.push({
      //       ...it.data(),
      //     });
      //   });
      //   setState(data);
      // });
      db.collection('chat').onSnapshot((v) => {
        const data: any[]= []
        v.forEach((vv) => {
          data.push({...vv.data()})
        })
        setState(data)
      })
    }
    fetch();
  }, []);
  

  const onSubmit = async (nip: string) => {
    setLoading(true);
    await db
      .collection(`chat`)
      .add({ username: auth.currentUser?.email , message: valMessage})
      .then(() => {
        toast({
          description: "Update Data Berhasil",
          status: "success",
        });
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
    setLoading(false);
  };

  return (
    <Container maxW={"container.xl"}>
        <InputWihtText
        title="Username"
        value={valMessage}
        onChange={(e) => setValMessage(e.target.value)}
      />
      <Button
        colorScheme={"green"}
        color={"white"}
        mt={2}
        isLoading={loading}
        onClick={() => onSubmit("state")}
      >
        Post
      </Button>

      {state.map((it)=> (
      <Box mt={2} bg='white' w='50%' p={4} color='white'>
        
           <HStack>
             <Avatar  src={it.username} name={it.username} />
              <VStack align={'start'}>
              <Box bg='blue'>{it.username}</Box>
              <Box bg='grey'>{it.message}</Box>

              </VStack>
           </HStack>
   
       </Box>
             ))}
    </Container>
  );
};

export default Room;
