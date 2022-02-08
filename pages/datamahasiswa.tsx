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

const DataMahasiswa = () => {
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

  const onDelete = async (nim: string) => {
    await db
      .doc(`data-mahasiswa/${nim}`)
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
          onClick={() => router.push("/tambah/mahasiswa")}
        >
          Tambah Mahasiswa
        </Button>
      </HStack>
      <Table variant="striped" size={"sm"} mt={5}>
        <Thead>
          <Tr>
            <Th>no</Th>
            <Th>NIM</Th>
            <Th>Nama</Th>
            <Th>Tahun Masuk</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {state.map((it, id) => (
            <Tr key={id}>
              
              <Td>{id+1}</Td>
              <Td>{it.nim}</Td>
              <Td>{it.nama}</Td>
              <Td>{it.tahunmasuk}</Td>
              <Td>
                <HStack>
                  <IconButton
                    aria-label="icon"
                    icon={<FiEdit2 />}
                    onClick={() => router.push(`/edit/mhs/${it.nim}`)}
                  />
                  <IconButton
                    aria-label="icon"
                    onClick={() => onDelete(it.nim)}
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

export default DataMahasiswa;
