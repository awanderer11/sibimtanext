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
import { db } from "../config/firebase";
import { FiLogIn } from "react-icons/fi";
import router from "next/router";

const Proposal = () => {
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
            <Th>Pembimbing 1</Th>
            <Th>Pembimbing 2</Th>
            <Th>Status Bimbingan</Th>
            <Th>Bimbingan</Th>
          </Tr>
        </Thead>
        <Tbody>
          {state.map((it, id) => (
            <Tr key={id}>
              <Td>{id + 1}</Td>
              <Td>{it.nim}</Td>
              <Td>{it.nama}</Td>
              <Td>{it.pembimbing1.nama}</Td>
              <Td>{it.pembimbing2.nama}</Td>
              <Td>{it.proposal}</Td>
              <Td><IconButton
                    aria-label="icon"
                    icon={<FiLogIn />}
                    onClick={() => router.push(`/bimbingan/${it.nim}`)}
                  /></Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Proposal;
