import React, { useEffect, useState } from "react";
import router from "next/router";
import { db, auth } from "../../config/firebase";
import { Container, Button, useToast, Textarea, Text, SimpleGrid, VStack, Box, HStack, Avatar  } from "@chakra-ui/react";
import { InputWihtText } from "../../component/InputText";

const AjukanJudul = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState<any[]>([]);
  const [valMessage, setValMessage] = useState("");
  const [state, setState] = useState({
    nim:"",
    judul:{"judul":"", "abstrak":""}
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
      <Container>
      {chat.map((it)=> (
      <Box mt={4} bg='white' p={4} color='black'>
           <HStack align={'start'}>
             <Avatar  src={it.username} name={it.username} />
              <VStack align={'start'}>
              <Box bg='#F7FAFC'>{it.username}</Box>
              <Box bg='#F7FAFC'>{it.message}</Box>
              <VStack align={'end'}>
              <Button 
                 colorScheme={"green"}
                  color={"white"}
                  mt={2}
                  isLoading={loading}
                  onClick={() => onSubmitCHat()}
                  >
                    Reply
                 </Button>
                 </VStack>
              </VStack>
           </HStack>
       </Box>
             ))}
      </Container>
    <Container maxW={"container.xl"}>
        <InputWihtText
        title="Judul"
        value={state.judul.judul}
        onChange={(e) => setState((prev) => ({ ...prev, judul: {judul: e.target.value, abstrak: state.judul.abstrak} }))}
      />
      <div>
      <Text mt="2" mb='8px'>Abstrak</Text>
      <Textarea
        value={state.judul.abstrak}
        onChange={(e) =>
          setState((prev) => ({ ...prev, judul: {judul: state.judul.judul, abstrak: e.target.value} }))}
        height={"200px !important"}
      />
    </div>
    <VStack align={'end'}>
      <Button
        colorScheme={"green"}
        color={"white"}
        mt={2}
        isLoading={loading}
        onClick={() => onSubmit(state.nim)}
      >
        Update
      </Button>
      </VStack>
    </Container>
    </SimpleGrid>
  );
};

export default AjukanJudul;
