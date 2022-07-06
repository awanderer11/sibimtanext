import {
    Box,
    Table,
    Tbody,
    Td,
    Text,
    Th,
    Thead,
    Tr,
  } from "@chakra-ui/react";
  import React, { useEffect, useState } from "react";
  import { db, auth } from "../../../../config/firebase";
  import router from "next/router";
  
  const Hasil = () => {
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
                <Td _hover={{cursor:"pointer"}} onClick={() => router.push({pathname:`/mahasiswa/hasil/${state.nim}`, query:{nip: state.pembimbing1.nip}})} >{state.pembimbing1.nama}</Td>
                <Td _hover={{cursor:"pointer"}} onClick={() => router.push({pathname:`/mahasiswa/hasil/${state.nim}`, query:{nip: state.pembimbing2.nip}})} >{state.pembimbing2.nama}</Td>
              </Tr>
          </Tbody>
        </Table>
      </Box>
    );
  };
  
  export default Hasil;
  