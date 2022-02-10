import {
    Box,
    Button,
    HStack,
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
  import { FiPlus } from "react-icons/fi";
  import { db } from "../../config/firebase";
  const JudulSkripsi = () => {
    const [state, setState] = useState<any[]>([]);
    const toast = useToast();
    useEffect(() => {
      async function fetch() {
        db.collection("judulskripsi").onSnapshot((docs) => {
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
              <Th>Tahun</Th>
              <Th>Judul</Th>
            </Tr>
          </Thead>
          <Tbody>
            {state.map((it, id) => (
              <Tr key={id}>
                <Td>{id + 1 }</Td>
                <Td>{it.tahun}</Td>
                <Td>{it.judul}</Td>
                
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
    );
  };
  
  export default JudulSkripsi;
  