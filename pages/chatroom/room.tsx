import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { Container, Button, useToast, Box, HStack, Avatar, VStack, Textarea } from "@chakra-ui/react";
import { InputWihtText } from "../../component/InputText";

const Room = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<any[]>([]);
  const [state1, setState1] = useState<any[]>([]);
  const [valMessage, setValMessage] = useState("")
  const [valMessage1, setValMessage1] = useState("")
 
  useEffect(() => {
    async function fetch() {
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
  

  const onSubmit = async () => {
    setLoading(true);
    await db
      .collection(`chat`)
      .add({ username: auth.currentUser?.email , message: valMessage})
      .then(() => {
        toast({
          description: "Post Berhasil",
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
      <Textarea 
        value={valMessage}
        onChange={(e) => setValMessage(e.target.value)}
        placeholder=''
        size='sm'
        height={"200px !important"}
        width={"50%"}/>
        <div>
        <VStack align={'start'}>
      <Button
        colorScheme={"green"}
        color={"white"}
        mt={2}
        isLoading={loading}
        onClick={() => onSubmit()}
      >
        Post
      </Button>
      </VStack>
      </div>
      {state.map((it)=> (
      <Box mt={2} bg='white' w='50%' p={4} color='black'>
           <HStack>
             <Avatar  src={it.username} name={it.username} />
              <VStack align={'start'}>
              <Box bg='#F7FAFC'>{it.username}</Box>
              <Box bg='#F7FAFC'>{it.message}</Box>
              <Button 
                 colorScheme={"green"}
                  color={"white"}
                  mt={2}
                  isLoading={loading}
                  onClick={() => onSubmit()}
                  >
                    Reply
                 </Button>
              </VStack>
              
           </HStack>
          
       </Box>
             ))}
    </Container>
  );
};

export default Room;
