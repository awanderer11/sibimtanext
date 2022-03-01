import { 
    Box,
    SimpleGrid,
    Container,
    HStack,
    Text,
    IconButton,
    VStack,
   } from '@chakra-ui/react';
  import type { NextPage } from 'next'
  import { useEffect, useState } from "react";
  import { db, auth } from "../../../config/firebase";
  import { FiUsers, FiUser } from "react-icons/fi";
  import router from "next/router";

  const Dosen = () => {
    const [statebim1, setStatebim1] = useState<any[]>([]);
    const [statebim2, setStatebim2] = useState<any[]>([]);

    const [stateDosen, setStateDosen] = useState({
        nama: "",
        nip: "",
      });

      useEffect(() => {
        async function fetch() {
            await db
              .doc(`data-dosen/${router.query.nip}`)
              .get()
              .then((docs) => {
                setStateDosen({ ...(docs.data() as any) });
              })
              .catch((e) => {
                console.log(e);
              });
        }
        fetch();
      }, []);

      //findpem1
  useEffect(() => {
    async function fetch() {
        db.collection("data-mahasiswa").where("nip1", "==", router.query.nip ).onSnapshot((docs) => {
          const data: any[] = [];
          docs.forEach((it) => {
            data.push({
              ...it.data(),
            });
          });
          setStatebim1(data);
        });
        
    }
    fetch()
},[]);

  //findpem2
  useEffect(() => {
    async function fetch() {
        db.collection("data-mahasiswa").where("nip2", "==", router.query.nip ).onSnapshot((docs) => {
          const data: any[] = [];
          docs.forEach((it) => {
            data.push({
              ...it.data(),
            });
          });
          setStatebim2(data);
        });
        
      }
    fetch()
},[]);


      return (
        <>
        Selamat datang, 
        <Text fontWeight={600}>
        {stateDosen.nama}
        </Text>
         <SimpleGrid columns={2} spacing={10}>
        <Container >
        <HStack mt={4}>
        <Box bg="#4299E1" height={100} width={250} borderWidth='1px' borderRadius='lg' borderBottomRadius={1}>
        <SimpleGrid columns={2}  >
        <VStack align={"start"}>
        <HStack >
          <Box mt={2} ml={2} >
          <IconButton
          _hover={{cursor:"default"}}
          height={20}
          width={20}
          aria-label="icon"
          icon={ <FiUsers />}
          />
        </Box>
        <VStack>
        <Text width={150} color={"white"}>{statebim1.length}</Text>
        <Text width={150} color={"white"}>Mahasiswa</Text>
        </VStack>
        </HStack>
        <Box height={10} width={248} borderColor={"#4299E1"} borderWidth='1px' borderRadius='lg' borderTopRadius={0} borderTop={0}>
        <Text margin={2} color={"#4299E1"}>Mahasiswa Bimbingan 1</Text>
        </Box>
        </VStack>
        </SimpleGrid>
        </Box>
        <Box bg="#48BB78" height={100} width={250} borderWidth='1px' borderRadius='lg' borderBottomRadius={1}>
        <SimpleGrid columns={2}  >
        <VStack align={"start"}>
        <HStack >
          <Box mt={2} ml={2} >
          <IconButton
          height={20}
          width={20}
          _hover={{cursor:"default"}}
          aria-label="icon"
          icon={ <FiUsers />}
          />
          </Box>
          <VStack>
        <Text width={150} color={"white"}>{statebim2.length}</Text>
        <Text width={150} color={"white"}>Mahasiswa</Text>
        </VStack>
          <Box >
        </Box>
        </HStack>
        <Box height={10} width={248} borderColor={"#48BB78"} borderWidth='1px' borderRadius='lg' borderTopRadius={0} borderTop={0}>
        <Text margin={2} color={"#48BB78"}>Mahasiswa Bimbingan 2</Text>
        </Box>
        </VStack>
        </SimpleGrid>
        </Box>
        </HStack>
        </Container>
        </SimpleGrid>
        </>
      )
  }
  export default Dosen;