import {
  Box,
  Button,
  HStack,
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
import { FiPlus, FiEdit2, FiTrash2 } from "react-icons/fi";
import { db } from "../config/firebase";
import { Checkbox, CheckboxGroup } from '@chakra-ui/react'
const JudulSkripsi = () => {
  const [state, setState] = useState<any[]>([]);
  const toast = useToast();
  useEffect(() => {
    async function fetch() {
      db.collection("data-penduduk").onSnapshot((docs) => {
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

  const onDelete = async (nik: string) => {
    await db
      .doc(`data-penduduk/${nik}`)
      .delete()
      .then(() => {
        toast({
          description: "Sukses Hapus Data",
          status: "success",
        });
      })
      .catch((e) => {
        toast({
          description: "Gagal Hapus Data",
          status: "error",
        });
      });
  };

  if (!state) return <Text>Loading...</Text>;

  return (
    <Box>
      <HStack>
        <Button
          leftIcon={<FiPlus />}
          colorScheme={"green"}
          onClick={() => router.push("/tambah-penduduk")}
        >
          Tambah Judul Skripsi
        </Button>
      </HStack>
      <Table variant="striped" size={"sm"} mt={5}>
        <Thead>
          <Tr>
            <Th>no</Th>
            <Th>Tahun</Th>
            <Th>Judul</Th>
            
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
                <Td>1</Td>
                <Td>2020</Td>
                <Td>Sebuah Seni Bersikap Bodo Amat</Td>
                
              </Tr>
          {state.map((it, id) => (
            <Tr key={id}>
              
              {/* <Td>{it.nik}</Td>
              <Td>{it.nama}</Td>
              <Td>{it.umur}</Td>
              <Td>{it.jumlah_pendapatan}</Td>
              <Td>{it.jumlah_tanggungan}</Td>
              <Td>{it.bantuan}</Td> */}
              <Td>
                <HStack>
                  <IconButton
                    aria-label="icon"
                    icon={<FiEdit2 />}
                    onClick={() => router.push(`/edit/${it.nik}`)}
                  />
                  <IconButton
                    aria-label="icon"
                    onClick={() => onDelete(it.nik)}
                    icon={<FiTrash2 />}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default JudulSkripsi;
