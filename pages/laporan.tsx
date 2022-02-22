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
import { db } from "../config/firebase";
import { Checkbox } from '@chakra-ui/react'
const Laporan = () => {
  const [state, setState] = useState<any[]>([]);
  const toast = useToast();
  useEffect(() => {
    async function fetch() {
      db.collection("data-mahasiswa").onSnapshot((docs) => {
        const data: any[] = [];
        docs.forEach((it) => {
          data.push({
            ...it.data(),
          });
        });
        setState(data);
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
            <Th>no</Th>
            <Th>NIM</Th>
            <Th>Nama</Th>
            <Th>SEMPRO</Th>
            <Th>SEMHAS</Th>
            <Th>Tutup</Th>
            <Th>Yudisium</Th>
            
          </Tr>
        </Thead>
        <Tbody>
          {state.map((it, id) => (
            <Tr key={id}>
              <Td>{id + 1}</Td>
              <Td>{it.nim}</Td>
              <Td>{it.nama}</Td>
              <Td><Checkbox isChecked={it.sempro} isDisabled ></Checkbox></Td>
              <Td><Checkbox isChecked={it.semhas} isDisabled ></Checkbox></Td>
              <Td><Checkbox isChecked={it.semtutup} isDisabled ></Checkbox></Td>
              <Td><Checkbox isChecked={it.yudisium} isDisabled ></Checkbox></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Laporan;
