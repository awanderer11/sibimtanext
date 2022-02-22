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
    Link
  } from "@chakra-ui/react";
  import React, { useEffect, useState } from "react";
  import { FiLogIn, FiUpload } from "react-icons/fi";
  import router from "next/router";
  import { db } from "../../../config/firebase";
  
  const PengajuanJudul = () => {
    const [state, setState] = useState({
        nim: "",
        nama: "",
        judul:{"judul":"", "created_at":"", "updated_at":"", "url":""},
        pembimbing1: {"nip":"","nama": ""},
        pembimbing2: {"nip":"","nama": ""},
        
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
              <Th>Masuk</Th>
            </Tr>
          </Thead>
          <Tbody>
              <Tr>
                <Td>{state.nim}</Td>
                <Td>{state.nama}</Td>
               <Td>{state.judul.judul === "" ? <IconButton
                      aria-label="icon"
                      icon={<FiUpload />}
                      onClick={() => router.push(`/uploadfile/${state.nim}`)}
                    /> : state.judul.judul }</Td>
                <Td>{state.pembimbing1.nama}</Td>
                <Td>{state.pembimbing2.nama}</Td>
                {/* <Td><Link href="/">{state.pembimbing2.nama}</Link></Td> */}
                <Td><IconButton
                      aria-label="icon"
                      icon={ <FiLogIn />}
                      onClick={() => {state.judul.url === "" ? toast({
                        description: "Upload Berkas Judul!",
                        status: "error",
                      }) : router.push(`/pengajuan/${state.nim}`) }}
                    /></Td>
              </Tr>
          </Tbody>
        </Table>
      </Box>
    );
  };
  
  export default PengajuanJudul;
  