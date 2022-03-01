import { 
  Container, 
  useToast,Box, 
  InputGroup, 
  Input,
  InputLeftAddon, 
  SimpleGrid, 
  Table,
  Th,
  Thead,
  Tr, 
  Tbody,
  Td, 
  IconButton,
  Button,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  FormControl,
  FormLabel,
  ModalFooter,
  VStack,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { FiLogIn, FiPlus } from "react-icons/fi";
import { db, FirebaseApp } from "../../../config/firebase";
import router from "next/router";

const Proposal = () => {
const toast = useToast();
const { isOpen, onOpen, onClose } = useDisclosure();
const [valMessage, setValMessage] = useState("");
const [loading, setLoading] = useState(false);
const [stateMhs, setStateMhs] = useState<any[]>([]);
const [state, setState] = useState({
  nim: "",
  nama: "",
  judul:{"judul":"", "created_at":"", "updated_at":"", "url":""},
  tanggallahir: "",
  tahunmasuk: "",
  email: "",
  kontak: "",
  alamat: "",
  jeniskelamin: "",
  agama: "",
  img_url:"",
  sempro: false,
  prpsl:{bab1:{tglBimbingan:"", status:"", keterangan:""}, bab2:{tglBimbingan:"", status:"", keterangan:""}},
  updated_at: new Date().toISOString().substring(0, 10),
});

useEffect(() => {
  async function fetch() {
    await db
      .doc(`data-mahasiswa/${router.query.nim}`)
      .get()
      .then((docs) => {
        setState({ ...(docs.data() as any) });
      })
      .catch((e) => {
        console.log(e);
      });
  }
  fetch();
}, []);

useEffect(() => {
  async function fetch() {
    db.collection(`data-mahasiswa/${router.query.nim}/proposal`).onSnapshot((docs) => {
      const data: any[] = [];
      docs.forEach((it) => {
        data.push({
          ...it.data(),
        });
      });
      setStateMhs(data);
    });
  }
  fetch();
}, []);

const onSubmit = async () => {
  setLoading(true);
  const id = Date.now().toString();
  await db.doc(`data-mahasiswa/${router.query.nim}/proposal/${id}`)
    .set({ topikBahasan: valMessage, tglBimbingan: new Date().toLocaleDateString().substring(0, 10),
            fileUrl: "",
            imgUrl: "",
            keterangan: "",
            review: "",
            status: "",
            id:  id,
    })
    .then(() => {
      toast({
        description: "Berhasil Menambah Topik",
        status: "success",
      });
      setLoading(false);
      setValMessage("");
    })
    .catch((e) => {
      console.log(e);
    });
    onClose();
  setLoading(false);
};

const onSubmitAcc = async (nim: string) => {
  setLoading(true);
  await db
  .doc(`data-mahasiswa/${nim}`)
  .update({...state, sempro: true} )
  .then(() => {
    toast({
      description: "Berhasil",
      status: "success",
    });
    setLoading(false);
  })
  .catch((e) => {
    console.log(e);
  });
setLoading(false);
return;
};
return (
  <SimpleGrid columns={1} spacing={10}>
  <Container maxW={"container.xl"}>
    <InputGroup mt={2}>
      <InputLeftAddon children='NIM' />
      <Input type='tel' placeholder=''  value={state.nim} 
      />
      </InputGroup>
    <InputGroup mt={2}>
      <InputLeftAddon children='Nama' />
      <Input type='tel' placeholder=''   value={state.nama} 
      />
      </InputGroup>
    <InputGroup mt={2}>
      <InputLeftAddon children='Judul' />
      <Input type='tel' placeholder=''   value={state.judul.judul} 
      />
      </InputGroup>
      <Button
        mt={4}
        leftIcon={<FiPlus />}
        colorScheme={"green"}
        onClick={onOpen}
      >
        Tambah Topik Bahasan
      </Button>
      <Modal
      isOpen={isOpen}
      onClose={onClose}
       >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Tambah Topik Bahasan</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <FormControl>
            <FormLabel>Topik Bahasan</FormLabel>
            <Input  value={valMessage} onChange={(e) => setValMessage(e.target.value)} />
          </FormControl>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={()=> onSubmit()}>
            Simpan
          </Button>
          <Button onClick={onClose}>Batal</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  <Box>
    <Table variant="striped" size={"sm"} mt={5}>
      <Thead>
        <Tr>
          <Th>No</Th>
          <Th>Tanggal Bimbingan</Th>
          <Th>Topik Bahasan</Th>
          <Th>Status Bimbingan</Th>
          <Th>Bimbingan</Th>
        </Tr>
      </Thead>
      <Tbody>
      {stateMhs.map((it, id) => (
          <Tr key={id}>
            <Td>{id +1 }</Td>
            <Td>{it.tglBimbingan}</Td>
            <Td>{it.topikBahasan}</Td>
            <Td>{it.status}</Td>
            <Td><IconButton
                  aria-label="icon"
                  icon={<FiLogIn />}
                  onClick={() => router.push(`/mahasiswa/proposal/topik/${state.nim}/${it.id}`)}
                /></Td>
          </Tr>
          ))}
      </Tbody>
    </Table>
  </Box>
  <VStack align={"end"}>
       <Button
          mt={4}
          colorScheme={"green"}
          isLoading={loading}
        onClick={() => router.back()}
        >
          Kembali
        </Button>
        </VStack>
  </Container>
  </SimpleGrid>
);
};

export default Proposal;
