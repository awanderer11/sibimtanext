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
  import { Checkbox } from '@chakra-ui/react'
  import React, { useEffect, useState } from "react";
  import router from "next/router";
  import { db } from "../../../config/firebase";
  
  const Proposal = () => {
    const [state, setState] = useState({
        nim: "",
        nama: "",
        sempro: false,
        semhas: false,
        semtutup: false,
        yudisium: false,
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
              <Th>SEMPRO</Th>
              <Th>SEMHAS</Th>
              <Th>TUTUP</Th>
              <Th>Yudisium</Th>
            </Tr>
          </Thead>
          <Tbody>
              <Tr>
                <Td>{state.nim}</Td>
                <Td>{state.nama}</Td>
                <Td><Checkbox isChecked={state.sempro} isDisabled ></Checkbox></Td>
              <Td><Checkbox isChecked={state.semhas} isDisabled ></Checkbox></Td>
              <Td><Checkbox isChecked={state.semtutup} isDisabled ></Checkbox></Td>
              <Td><Checkbox isChecked={state.yudisium} isDisabled ></Checkbox></Td>
              
              </Tr>
          </Tbody>
        </Table>
      </Box>
    );
  };
  
  export default Proposal;
  