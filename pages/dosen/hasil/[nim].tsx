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
  HStack,
} from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { FiLogIn, FiPlus } from "react-icons/fi";
import { db, auth } from "../../../config/firebase";
import router from "next/router";

const Hasil = () => {
const toast = useToast();
const { isOpen, onOpen, onClose } = useDisclosure();
const { isOpen: isOpenAcc, onOpen: onOpenAcc, onClose: onCloseAcc } = useDisclosure();
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
  semhas: false,
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
    let nip = "";
      await db.collection("data-dosen").where("email", "==", auth.currentUser?.email).get().then((d)=>{
           d.forEach((d) => {
          nip = d.data().nip
           })
       })
    db.collection(`data-mahasiswa/${router.query.nim}/hasil`).where("nip", "==", nip).onSnapshot((docs) => {
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
  await db.doc(`data-mahasiswa/${router.query.nim}/hasil/${id}`)
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
  .update({...state, semhas: true} )
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
  onCloseAcc();
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
      <VStack align={"end"}>
      <Button
        mt={4}
        leftIcon={<FiPlus />}
        colorScheme={"green"}
        onClick={onOpen}
      >
         Topik Bahasan
      </Button>
      </VStack>
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
                  onClick={() => router.push(`/dosen/hasil/topik/${state.nim}/${it.id}`)}
                /></Td>
          </Tr>
          ))}
      </Tbody>
    </Table>
  </Box>
       <VStack align={"end"}>
        <HStack align={"end"}>
        <Button
          mt={4}
          colorScheme={"green"}
          isLoading={loading}
        onClick={onOpenAcc}
        >
          ACC Hasil
        </Button>

        <Modal
       isOpen={isOpenAcc}
       onClose={onCloseAcc}
         >
        <ModalOverlay />
       <ModalContent>
        <ModalHeader>ACC HASIL?</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={() => onSubmitAcc(state.nim)}>
            ACC
          </Button>
          <Button onClick={onCloseAcc}>Batal</Button>
        </ModalFooter>
       </ModalContent>
       </Modal>

        <Button
        mt={4}
        marginLeft={4}
        colorScheme={"green"}
        isLoading={loading}
      onClick={() => router.back()}
      >
        Kembali
      </Button>
      </HStack>
      </VStack>
  </Container>
  </SimpleGrid>
);
};

export default Hasil;
