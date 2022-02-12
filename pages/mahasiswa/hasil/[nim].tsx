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
  } from "@chakra-ui/react";
  import React, { useEffect, useState } from "react";
  import router from "next/router";
  import { db } from "../../../config/firebase";
  
  const Hasil = () => {
    const [state, setState] = useState({
        nim: "",
        nama: "",
        judul: {"judul":"","abstrak": ""},
        pembimbing1: {"nip":"","nama": ""},
        pembimbing2: {"nip":"","nama": ""},
        status: "",
        updated_at: Date.now().toString(),
      });
    const toast = useToast();
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
              <Th>Status Bimbingan</Th>
            </Tr>
          </Thead>
          <Tbody>
              <Tr>
                <Td>{state.nim}</Td>
                <Td>{state.nama}</Td>
                <Td>{state.judul.judul}</Td>
                <Td>{state.pembimbing1.nama}</Td>
                <Td>{state.pembimbing2.nama}</Td>
                <Td>{state.status}</Td>
              </Tr>
          </Tbody>
        </Table>
      </Box>
    );
  };
  
  export default Hasil;
  