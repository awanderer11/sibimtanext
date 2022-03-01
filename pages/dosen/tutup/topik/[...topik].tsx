import { 
    Container, 
    useToast,Box, 
    InputGroup, 
    Input,
    InputLeftAddon, 
    SimpleGrid, 
    Select,
    IconButton,
    Button,
    Textarea,
    HStack,
    VStack,
    Modal, 
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
 } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { FiDownload,  } from "react-icons/fi";
import { db } from "../../../../config/firebase";
import router from "next/router";

const tutup = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const topik = router.query.topik || []
  const [loading, setLoading] = useState(false);
  const [stateMhs, setStateMhs] = useState({
    id:"",
    fileUrl:"",
    imgUrl:"",
    keterangan:"",
    tglBimbingan:"",
    review:"",
    status:"",
    topikBahasan:"",
  });
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
    prpsl:{bab1:{tglBimbingan:"", status:"", keterangan:""}, bab2:{tglBimbingan:"", status:"", keterangan:""}},
    updated_at: new Date().toISOString().substring(0, 10),
  });

  useEffect(() => {
    async function fetch() {
      await db
        .doc(`data-mahasiswa/${topik[0]}`)
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
      await db
        .doc(`data-mahasiswa/${topik[0]}`).collection("tutup").doc(`${topik[1]}`)
        .get()
        .then((docs) => {
          setStateMhs({ ...(docs.data() as any) });
        })
        .catch((e) => {
          console.log(e);
        });
    }
    fetch();
  }, []);


  const onSubmit = async (id: string) => {
    setLoading(true);
    await db
    .doc(`data-mahasiswa/${topik[0]}/tutup/${id}`)
    .update(stateMhs)
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
    onClose();
  setLoading(false);
  return;
  };

  if(!stateMhs){
    return <p>...Loading</p>
  }

  return (
    <SimpleGrid columns={2} spacing={10}>
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
        <InputGroup mt={2}>
        <InputLeftAddon children='Tanggal Bimbingan' />
        <Input type='tel' placeholder=''   value={stateMhs.tglBimbingan} 
        />
        
        </InputGroup>
        
    </Container>
    <Container>
      <InputGroup mt={2}>
        <InputLeftAddon children='Topik Bahasan' />
        <Input type='tel' placeholder=''   value={stateMhs.topikBahasan} 
        />
        </InputGroup>
        <InputGroup mt={2}>
        <InputLeftAddon children='Unduh Berkas' />
        <a target="_blank" href={stateMhs.fileUrl} rel="noopener noreferrer"> 
        <IconButton
         aria-label="icon"
        icon={ <FiDownload />}
          />
        </a>
        </InputGroup>
        <InputGroup mt={2}>
        <InputLeftAddon children='Unduh Media' />
      
      <a target="_blank" href={stateMhs.imgUrl} rel="noopener noreferrer"> 
      <IconButton
      aria-label="icon"
      icon={ <FiDownload />}
        />
      </a>
        </InputGroup>
    
      <InputGroup mt={2}>
        <InputLeftAddon children='Status Bimbingan' />
        <Select value={stateMhs.status} onChange={(e)=> setStateMhs((prev: any) => ({ ...prev, status: e.target.value }))} placeholder='' >
        <option value='Belum Direview'>Belum Direview</option>
        <option value='Revisi'>Revisi</option>
       <option value='ACC'> ACC</option>
        </Select>
        </InputGroup>
      <InputGroup mt={2}>
        <InputLeftAddon children='Keterangan' />
        <Textarea onChange={(e) => setStateMhs((prev) => ({ ...prev, keterangan: e.target.value }))} value={stateMhs.keterangan} placeholder='Tulis keterangan'></Textarea>
        </InputGroup>
        <VStack align={"end"}>
        <HStack align={"end"}>
        <Button
          mt={4}
          colorScheme={"green"}
          isLoading={loading}
        onClick={() => onSubmit(stateMhs.id)}
        >
          Kirim
        </Button>
        <Modal
       isOpen={isOpen}
       onClose={onClose}
         >
        <ModalOverlay />
       <ModalContent>
        <ModalHeader>Kirim Keterangan dan Status Bimbingan?</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={() => onSubmit(stateMhs.id)}>
            Kirim
          </Button>
          <Button onClick={onClose}>Batal</Button>
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

export default tutup;
