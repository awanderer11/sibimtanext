import React, { useEffect, useState } from "react";
import router from "next/router";
import { db, auth } from "../../config/firebase";
import { FiLogIn, FiDownload, FiUpload } from "react-icons/fi";
import { Container, Button, useToast, Textarea, InputGroup, SimpleGrid, VStack, Box, HStack, Avatar, IconButton, InputLeftAddon, Input  } from "@chakra-ui/react";
import { InputWihtText } from "../../component/InputText";

const AjukanJudul = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<any[]>([]);
  const [valMessage, setValMessage] = useState("");
  const [state, setState] = useState({
    nim:"",
    judul:{"judul":"", "created_at":"", "updated_at":"", "url":""},
  });

  useEffect(() => {
    async function fetch() {
      await db
        .doc(`data-mahasiswa/${router.query.nim}`)
        .get()
        .then((docs) => {
          setState({ ...(docs.data() as any) });
        })
        .catch((e) => {
          console.log(e);
        });
    }
    fetch();
  }, []);


  useEffect(() => {
    async function fetch() {
      db.doc(`data-mahasiswa/${router.query.nim}`).collection('chat').orderBy("created_at", "desc" ).onSnapshot((v) => {
        const data: any[]= []
        v.forEach((vv) => {
          data.push({...vv.data()})
        })
        setChat(data)
      })
    }
    fetch();
  }, []);

  const onSubmitCHat = async () => {
    setLoading(true);
    await db.doc(`data-mahasiswa/${router.query.nim}`)
      .collection(`chat`)
      .add({ username: auth.currentUser?.email , message: valMessage, created_at:Date.now().toString(),})
      .then(() => {
        toast({
          description: "Post Berhasil",
          status: "success",
        });
        setLoading(false);
        setValMessage("");
      })
      .catch((e) => {
        console.log(e);
      });
    setLoading(false);
  };
  const onSubmit = async (nim: string) => {
    setLoading(true);
    await db
      .doc(`data-mahasiswa/${nim}`)
      .update(state)
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
    <SimpleGrid columns={2} spacing={10}>
      <Container maxW={"container.xl"}>   
    <Textarea 
        value={valMessage}
        onChange={(e) => setValMessage(e.target.value)}
        size='lg'
        mt={2}
        height={"50px !important"}
        />
        <div>
        <VStack align={'end'}>
      <Button
        colorScheme={"green"}
        color={"white"}
        mt={2}
        isLoading={loading}
        onClick={() => onSubmitCHat()}
      >
        Send
      </Button>
      </VStack>
      </div>
      {chat.map((it)=>{
        if(it.username === auth.currentUser?.email){
         return (
            <Box mt={2} bg='white' p={2} color='black'>
                    <VStack align={'end'}>
                 <HStack align={'end'}>
                    <VStack align={'end'}>
                    <Box bg='#F7FAFC'>{it.username}</Box>
                    <Box bg='#F7FAFC'>{it.message}</Box>
                    </VStack>
                   <Avatar  src={it.username} name={it.username} />
                 </HStack>
                  </VStack>
             </Box>
          )
        } else{
         return (
            <Box  mt={2} bg='white' p={2} color='black'>
                 <HStack align={'end'}>
                   <Avatar  src={it.username} name={it.username} />
                    <VStack align={'start'}>
                    <Box bg='#F7FAFC'>{it.username}</Box>
                    <Box bg='#F7FAFC'>{it.message}</Box>
                    </VStack>
                 </HStack>
             </Box>
                   )
        }
      })}
    </Container>
    <Container maxW={"container.xl"}>
      <InputGroup mt={2}>
        <InputLeftAddon children='Judul' />
        <Input type='tel' placeholder=''  value={state.judul.judul} />
        </InputGroup>
      <Box>
      <a target="_blank" href={state.judul.url} rel="noopener noreferrer"> 
      <IconButton
      mt={2}
      aria-label="icon"
      icon={ <FiDownload />}
                    />
      </a>
      <IconButton
      mt={2}
      ml={2}
      aria-label="icon"
      icon={ <FiUpload />}
      onClick={() => router.push(`/uploadfile/${state.nim}`)}
                    />
      </Box>
    </Container>
    </SimpleGrid>
  );
};

export default AjukanJudul;
