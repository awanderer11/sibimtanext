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
import { db, auth } from "../config/firebase";
import { Checkbox } from "@chakra-ui/react";

const Laporan = () => {
  const [state, setState] = useState<any[]>([]);
  const toast = useToast();
  useEffect(() => {
    async function fetch() {
      if (auth.currentUser?.email === "sibimta@email.com") {
        db.collection("data-mahasiswa").onSnapshot((docs) => {
          const data: any[] = [];
          docs.forEach((it) => {
            data.push({
              ...it.data(),
            });
          });
          setState(data);
        });
      } else {
        const data1: any[] = [];
        const data2: any[] = [];
        db.collection("data-dosen")
          .where("email", "==", auth.currentUser?.email)
          .get()
          .then((d) => {
            let nips = "";
            let isLogin = false;
            d.forEach((d) => {
              isLogin = d.data().isLogin;
              nips = d.data().nip;
            });
            db.collection("data-mahasiswa")
              .where("nip1", "==", nips)
              .onSnapshot((docs) => {
                docs.forEach((it) => {
                  data1.push({
                    ...it.data(),
                  });
                });
              });
            db.collection("data-mahasiswa")
              .where("nip2", "==", nips)
              .onSnapshot((docs) => {
                docs.forEach((it) => {
                  data2.push({
                    ...it.data(),
                  });
                });
                let data = data1.concat(data2);
                setState(data);
              });
          });
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
              <Td>
                <Checkbox isChecked={it.sempro} isDisabled></Checkbox>
              </Td>
              <Td>
                <Checkbox isChecked={it.semhas} isDisabled></Checkbox>
              </Td>
              <Td>
                <Checkbox isChecked={it.semtutup} isDisabled></Checkbox>
              </Td>
              <Td>
                <Checkbox isChecked={it.yudisium} isDisabled></Checkbox>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
  );
};

export default Laporan;
