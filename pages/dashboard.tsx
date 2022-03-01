import { 
    Box,
    SimpleGrid,
    Container,
    HStack,
    Text,
    IconButton,
    VStack,
   } from '@chakra-ui/react';
  import { useEffect, useState } from "react";
  import { db,  } from "../config/firebase";
  import { FiUsers,  } from "react-icons/fi";
  import router from "next/router";

  const Dashboard = () => {
    const [stateDosen, setStateDosen] = useState<any[]>([]);
    const [stateM, setStateM] = useState<any[]>([]);

//finddosen
useEffect(() => {
    async function fetch() {
      db.collection("data-dosen").onSnapshot((docs) => {
        const data: any[] = [];
        docs.forEach((it) => {
          data.push({
            ...it.data(),
          });
        });
        setStateDosen(data);
      });
    }
    fetch();
  }, []);
//findMhs
  useEffect(() => {
    async function fetch() {
      db.collection("data-mahasiswa").onSnapshot((docs) => {
        const data: any[] = [];
        docs.forEach((it) => {
          data.push({
            ...it.data(),
          });
        });
        setStateM(data);
      });
    }
    fetch();
  }, []);    


      return (
        <>
        Selamat datang, 
        <Text fontWeight={600}>
        Admin Teknologi Pendidikan Fakultas Ilmu Pendidikan Universitas Negeri Makassar
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
          height={20}
          width={20}
          aria-label="icon"
          _hover={{cursor:"default"}}
          icon={ <FiUsers />}
          />
        </Box>
        <VStack>
        <Text width={150} color={"white"}>{stateDosen.length}</Text>
        <Text  width={150} color={"white"}>Dosen</Text>
        </VStack>
        </HStack>
        <Box height={10} width={248} borderColor={"#4299E1"} borderWidth='1px' borderRadius='lg' borderTopRadius={0} borderTop={0}>
        <Text _hover={{cursor:"pointer"}} onClick={() => router.push(`/datadosen`)} margin={2} color={"#4299E1"}>View Details</Text>
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
          aria-label="icon"
          _hover={{cursor:"default"}}
          icon={ <FiUsers />}
          />
          </Box>
          <VStack>
        <Text width={150} color={"white"}>{stateM.length}</Text>
        <Text width={150} color={"white"}>Mahasiswa</Text>
        </VStack>
          <Box >
        </Box>
        </HStack>
        <Box height={10} width={248} borderColor={"#48BB78"} borderWidth='1px' borderRadius='lg' borderTopRadius={0} borderTop={0}>
        <Text _hover={{cursor:"pointer"}} onClick={() => router.push(`/datamahasiswa`)} margin={2} color={"#48BB78"}>View Details</Text>
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
  export default Dashboard;