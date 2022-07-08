import type { NextPage } from 'next'
import { 
  useToast,Box, 
  Table,
  Th,
  Thead,
  Tr, 
  Tbody,
  Td, 
  IconButton,
} from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";
import React, { useState, useEffect } from "react";
import { db,  } from "../../config/firebase";

const Administrasi: NextPage = () => {
  const toast = useToast();
  const [state, setState] = useState<any[]>([]);

  useEffect(() => {
    async function fetch() {
      db.collection(`administrasi`).orderBy("created_at", "desc" ).onSnapshot((v) => {
        const data: any[]= []
        v.forEach((vv) => {
          data.push({...vv.data()})
        })
        setState(data)
      })
    }
    fetch();
  }, []);

  return (
    <div>
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
                <a target="_blank" href={it.fileUrl} rel="noopener noreferrer"> 
                  <IconButton
                    aria-label="icon"
                    icon={<FiDownload />}
                  />
                  </a>
                
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </div>
  )
}

export default Administrasi
