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
import { FiLogIn } from "react-icons/fi";
import { auth, db } from "../config/firebase";

const BimbinganJudul = () => {
  const [state, setState] = useState<any[]>([]);
  const toast = useToast();
  
  useEffect(() => {
    async function fetch() {
      if(auth.currentUser?.email ==="sibimta@email.com"){
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
      else{
        db.collection("data-dosen").where("email", "==", auth.currentUser?.email).get().then((vd)=>{
          let nips  = ''
          let isLogin = false
            vd.forEach((b) => {
           isLogin = b.data().isLogin
           nips = b.data().nip
            })
            db.collection("data-mahasiswa").where("nip1", "==", nips).onSnapshot((docs) => {
              if(docs.empty){
                db.collection("data-mahasiswa").where("nip2", "==", nips).onSnapshot((docsv) => {
                  const data: any[] = [];
                  docsv.forEach((it) => {
                    data.push({
                      ...it.data(),
                    });
                  });
                  setState(data);
                });
              }
              const data: any[] = [];
              docs.forEach((it) => {
                data.push({
                  ...it.data(),
                });
              });
              setState(data);
            });
        })
        
        
      }
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
              <Td>{it.judul.created_at}</Td>
              <Td>{it.judul.updated_at}</Td>
              <Td>{it.selesaita}</Td>
              <Td>{it.statusbimbingan}</Td>
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

export default BimbinganJudul;
