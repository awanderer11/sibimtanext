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
import router from "next/router";
import { FiEdit2 } from "react-icons/fi";
import { db } from "../config/firebase";

const BimbinganJudul = () => {
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
            <Th>Judul</Th>
            <Th>Tanggal Pengajuan Judul</Th>
            <Th>Tanggal Selesai</Th>
            <Th>selesai TA</Th>
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
              <Td>{it.judul.judul}</Td>
              <Td>{it.pengajuanjudul}</Td>
              <Td>{it.tanggalselesai}</Td>
              <Td>{it.selesaita}</Td>
              <Td>{it.status}</Td>
              <Td><IconButton
                    aria-label="icon"
                    icon={<FiEdit2 />}
                    onClick={() => router.push(`/bimbingan/${it.nim}`)}
                  /></Td>
              
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default BimbinganJudul;
