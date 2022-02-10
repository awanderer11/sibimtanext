import {
    Box,
    IconButton,
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
  import { FiEdit2 } from "react-icons/fi";
  import router from "next/router";
  import { db } from "../../config/firebase";
  
  const PengajuanJudul = () => {
    const [state, setState] = useState({
        nim: "",
        nama: "",
        judul: "",
        pembimbing1: {"nip":"","nama": ""},
        pembimbing2: {"nip":"","nama": ""},
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
            </Tr>
          </Thead>
          <Tbody>
              <Tr>
                <Td>{state.nim}</Td>
                <Td>{state.nama}</Td>
                <Td><IconButton
                      aria-label="icon"
                      icon={<FiEdit2 />}
                      onClick={() => router.push(`/pengajuan/${state.nim}`)}
                    /></Td>
                <Td>{state.pembimbing1.nama}</Td>
                <Td>{state.pembimbing2.nama}</Td>
                
              </Tr>
          </Tbody>
        </Table>
      </Box>
    );
  };
  
  export default PengajuanJudul;
  