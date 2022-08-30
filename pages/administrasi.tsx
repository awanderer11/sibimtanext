import type { NextPage } from "next";
import {
  useToast,
  Table,
  Th,
  Thead,
  Tr,
  Tbody,
  Td,
  IconButton,
  Button,
  HStack,
} from "@chakra-ui/react";
import { FiDownload, FiTrash2, FiPlus } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { db } from "../config/firebase";
import router from "next/router";

const Administrasi: NextPage = () => {
  const toast = useToast();
  const [state, setState] = useState<any[]>([]);
  const [stateb, setStateb] = useState({
    id: "",
    fileName: "",
    fileUrl: "",
    created_at: Date.now().toString(),
    updated_at: Date.now().toString(),
  });

  useEffect(() => {
    async function fetch() {
      db.collection(`administrasi`)
        .orderBy("created_at", "desc")
        .onSnapshot((v) => {
          const data: any[] = [];
          v.forEach((vv) => {
            data.push({ ...vv.data() });
          });
          setState(data);
        });
    }
    fetch();
  }, []);

  const onDelete = async (id: string) => {
    await db
      .doc(`administrasi/${id}`)
      .delete()
      .then(() => {
        toast({
          description: "Berhasil Hapus Data",
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

  return (
    <div>
      <Button
        mt={4}
        leftIcon={<FiPlus />}
        colorScheme={"green"}
        onClick={() => router.push(`/tambah/administrasi`)}
      >
        File
      </Button>

      <Table variant="striped" size={"sm"} mt={5}>
        <Thead>
          <Tr>
            <Th>No.</Th>
            <Th>Nama File</Th>
            <Th>Aksi</Th>
          </Tr>
        </Thead>
        <Tbody>
          {state.map((it, id) => (
            <Tr key={id}>
              <Td>{id + 1}</Td>
              <Td>{it.fileName}</Td>
              <Td>
                <HStack>
                  <a
                    target="_blank"
                    href={it.fileUrl}
                    rel="noopener noreferrer"
                  >
                    <IconButton aria-label="icon" icon={<FiDownload />} />
                  </a>
                  <IconButton
                    aria-label="icon"
                    onClick={() => onDelete(it.id)}
                    icon={<FiTrash2 />}
                  />
                </HStack>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  );
};

export default Administrasi;
