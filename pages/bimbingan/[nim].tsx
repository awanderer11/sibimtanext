import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import { Container, 
  Button, 
  useToast,
  Box, 
  HStack, 
  Avatar, 
  VStack, 
  Textarea, 
  SimpleGrid, 
  Input, 
  InputGroup, 
  InputLeftAddon, 
  Select, 
  IconButton,
  Modal, 
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
 } from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";
import router from "next/router";

const Room = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<any[]>([]);
  const [valMessage, setValMessage] = useState("");
  const [dosen, setDosen] = useState<any[]>([]);
  const [mhs, setMhs] = useState({
    nim: "",
    nama: "",
    email: "",
    kontak: "",
    tahunmasuk: "",
    statusbimbigan: "",
    img_url:"",
    pembimbing2: {"nip":"","nama": ""},
    nim2:"",
    judul:{"judul":"", "created_at":"", "updated_at":"", "url":""},
  });
  useEffect(() => {
    async function fetch() {
      db.collection('data-dosen').onSnapshot((v) => {
        const data: any[]= []
        v.forEach((vv) => {
          data.push({...vv.data()})
        })
        setDosen(data)
      })
    }
    fetch();
  }, []);

  useEffect(() => {
    async function fetch() {
      await db
        .doc(`data-mahasiswa/${router.query.nim}`)
        .get()
        .then((docs) => {
          setMhs({ ...(docs.data() as any) });
        })
        .catch((e) => {
          console.log(e);
        });
    }
    fetch();
  }, []);
  
  useEffect(() => {
    async function fetch() {
      db.doc(`data-mahasiswa/${router.query.nim}`).collection('chat').orderBy("created_at", "desc" ).onSnapshot((v) => {
        const data: any[]= []
        v.forEach((vv) => {
          data.push({...vv.data()})
        })
        setState(data)
      })
    }
    fetch();
  }, []);

  const onSubmit = async () => {
    setLoading(true);
    await db.doc(`data-mahasiswa/${router.query.nim}`)
      .collection(`chat`)
      .add({ username: auth.currentUser?.email , message: valMessage, created_at:Date.now().toString(),})
      .then(() => {
        toast({
          description: "Post Berhasil",
          status: "success",
        });
        setLoading(false);
        setValMessage("");
      })
      .catch((e) => {
        console.log(e);
      });
    setLoading(false);
  };

  const onChangeValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(e.target.value !== "Pilih Pembimbing 2"){
      const parseJosn = JSON.parse(e.target.value)
       setMhs((prev) => ({ ...prev, pembimbing2: { nip: parseJosn.nip, nama: parseJosn.nama }, nim2: parseJosn.nip }));
    }
    return;
  }
  const onSubmitJudul = async (nim: string) => {
    setLoading(true);
    await db
      .doc(`data-mahasiswa/${nim}`)
      .update({...mhs, pembimbing2:{nip: mhs.pembimbing2.nip, nama: mhs.pembimbing2.nama}, statusbimbingan:"bimbingan"})
      .then(() => {
        toast({
          description: "Update Data Berhasil",
          status: "success",
        });
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
    setLoading(false);
  };

  return (
    <SimpleGrid columns={2} spacing={10}>
    <Container maxW={"container.xl"}>   
    <Textarea 
        value={valMessage}
        onChange={(e) => setValMessage(e.target.value)}
        size='lg'
        mt={2}
        height={"50px !important"}
        />
        <div>
        <VStack align={'end'}>
      <Button
        colorScheme={"green"}
        color={"white"}
        mt={2}
        isLoading={loading}
        onClick={() => onSubmit()}
      >
        Send
      </Button>
      </VStack>
      </div>
      {state.map((it)=>{
        if(it.username === auth.currentUser?.email){
         return (
            <Box mt={2} bg='white' p={2} color='black'>
                    <VStack align={'end'}>
                 <HStack align={'end'}>
                    <VStack align={'end'}>
                    <Box bg='#F7FAFC'>{it.username}</Box>
                    <Box bg='#F7FAFC'>{it.message}</Box>
                    </VStack>
                   <Avatar  src={it.username} name={it.username} />
                 </HStack>
                  </VStack>
             </Box>
          )
        } else{
         return (
            <Box  mt={2} bg='white' p={2} color='black'>
                 <HStack align={'end'}>
                   <Avatar  src={it.username} name={it.username} />
                    <VStack align={'start'}>
                    <Box bg='#F7FAFC'>{it.username}</Box>
                    <Box bg='#F7FAFC'>{it.message}</Box>
                    </VStack>
                 </HStack>
             </Box>
                   )
        }
      })}
        
    </Container>
    <Container>
        <Box> 
        <InputGroup>
        <InputLeftAddon children='Nim' />
        <Input type='tel' placeholder='' disabled value={mhs.nim} />
        </InputGroup>
        <InputGroup mt={2}>
        <InputLeftAddon children='Nama' />
        <Input type='tel' placeholder='' disabled value={mhs.nama}/>
        </InputGroup>
        <InputGroup mt={2}>
        <InputLeftAddon children='Kontak' />
        <Input type='tel' placeholder='' disabled value={mhs.kontak} />
        </InputGroup>
        <InputGroup mt={2}>
        <InputLeftAddon children='Email' />
        <Input type='tel' placeholder='' disabled value={mhs.email} />
        </InputGroup>
        <InputGroup mt={2}>
        <InputLeftAddon children='Tahun Masuk' />
        <Input type='tel' placeholder='' disabled value={mhs.tahunmasuk} />
        </InputGroup>
        <Box>
        {
          mhs.pembimbing2.nama !== "" ? 
          <InputGroup mt={2}>
          <InputLeftAddon children='Pembimbing 2' />
          <Input type='tel' placeholder='' disabled value={mhs.pembimbing2.nama} />
          </InputGroup>:
        <InputGroup mt={2}>
        <InputLeftAddon children='Pembimbing 2' />
        <Select onChange={(e) => onChangeValue(e)} placeholder='Pilih Pembimbing 2' >
        {dosen.map((it,id)=> <option key={id} defaultValue={JSON.stringify(it)} value={JSON.stringify(it)}>{it.nip +" "+it.nama}</option>)}
        </Select>
        </InputGroup>
        }
        <InputGroup mt={2}>
        <InputLeftAddon children='Judul' />
        <Input type='tel' placeholder='' disabled  value={mhs.judul.judul} />
        </InputGroup>
        <InputGroup mt={2}>
        <InputLeftAddon children='Unduh Berkas' />
        <a target="_blank" href={mhs.judul.url} rel="noopener noreferrer"> 
      <IconButton
      aria-label="icon"
      icon={ <FiDownload />}
        />
      </a>
        </InputGroup>
      
      </Box>
      <VStack align={"end"}>
        <HStack align={"end"}>
      <Button
        colorScheme={"green"}
        color={"white"}
        mt={2}
        isLoading={loading}
        onClick={onOpen}
      >
        Terima Judul
      </Button>
      <Modal
      isOpen={isOpen}
      onClose={onClose}
       >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Yakin Ingin Menyimpan Perubahan?</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={() => onSubmitJudul(mhs.nim)}>
            Simpan
          </Button>
          <Button onClick={onClose}>Batal</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>

      <Button
      mt={2}
          marginLeft={4}
          colorScheme={"green"}
          isLoading={loading}
        onClick={() => router.back()}
        >
          Kembali
        </Button>
        </HStack>
        </VStack>
      </Box>
      

    </Container>
    </SimpleGrid>

  );
};

export default Room;
