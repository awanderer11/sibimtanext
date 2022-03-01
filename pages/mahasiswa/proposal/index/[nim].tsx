import {
    Box,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
    useToast,
    IconButton
  } from "@chakra-ui/react";
  import React, { useEffect, useState } from "react";
  import { db, auth } from "../../../../config/firebase";
  import { FiLogIn } from "react-icons/fi";
  import router from "next/router";
  
  const Proposal = () => {
    const [state, setState] = useState({
        nim: "",
        nama: "",
        judul:{"judul":"", "created_at":"", "updated_at":"", "url":""},
        pembimbing1:{nama:"", nip:""},
        pembimbing2:{nama:"", nip:""},
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
  
  
    if (!state) return <Text>Loading...</Text>;
  
    return (
      <Box>
        <Table variant="striped" size={"sm"} mt={5}>
          <Thead>
            <Tr>
              <Th>NIM</Th>
              <Th>Nama</Th>
              <Th>Judul</Th>
              <Th>Pembimbing 1</Th>
              <Th>Pembimbing 2</Th>
            </Tr>
          </Thead>
          <Tbody>
              <Tr >
                <Td>{state.nim}</Td>
                <Td>{state.nama}</Td>
                <Td>{state.judul.judul}</Td>
                <Td>{state.pembimbing1.nama}</Td>
                <Td _hover={{cursor:"pointer"}} onClick={() => router.push(`/mahasiswa/proposal/${state.nim}`)} >{state.pembimbing2.nama}</Td>
              </Tr>
          </Tbody>
        </Table>
      </Box>
    );
  };
  
  export default Proposal;
  