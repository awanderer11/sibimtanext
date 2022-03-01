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
  import { db,  } from "../../../config/firebase";
  import { FiUser } from "react-icons/fi";
  import router from "next/router";

  const Mahasiswa = () => {
    const [stateMhs, setStateMhs] = useState({
        nim: "",
        nama: "",
        email: "",
        img_url:"",
        pembimbing1:{nama:"", nip:""},
        pembimbing2:{nama:"", nip:""},
      });

      useEffect(() => {
        async function fetch() {
            await db
              .doc(`data-mahasiswa/${router.query.nim}`)
              .get()
              .then((docs) => {
                setStateMhs({ ...(docs.data() as any) });
              })
              .catch((e) => {
                console.log(e);
              });
        }
        fetch();
      }, []);


      return (
        <>
          Selamat datang, 
          <Text fontWeight={600}>
          {stateMhs.nama}
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
            _hover={{cursor:"default"}}
            aria-label="icon"
            icon={ <FiUser />}
            />
          </Box>
          <Text width={150} color={"white"}>Pembimbing 1</Text>
          </HStack>
          <Box height={10} width={248} borderColor={"#4299E1"} borderWidth='1px' borderRadius='lg' borderTopRadius={0} borderTop={0}>
          <Text margin={2} color={"#4299E1"}>{stateMhs.pembimbing1.nama}</Text>
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
            icon={ <FiUser />}
            />
            </Box>
              <Text width={150} color={"white"}>Pembimbing 2</Text>
            <Box >
          </Box>
          </HStack>
          <Box height={10} width={248} borderColor={"#48BB78"} borderWidth='1px' borderRadius='lg' borderTopRadius={0} borderTop={0}>
          <Text margin={2} color={"#48BB78"}>{stateMhs.pembimbing2.nama}</Text>
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
  export default Mahasiswa;