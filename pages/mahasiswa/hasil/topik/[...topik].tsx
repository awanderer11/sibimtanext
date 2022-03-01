import { 
    Container, 
    useToast,
    VStack,
    InputGroup, 
    Input,
    InputLeftAddon, 
    SimpleGrid, 
    Select,
    Text,
    Button,
    Textarea,
    HStack,
    Modal, 
  ModalOverlay,
  ModalHeader,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
 } from "@chakra-ui/react";
 import FilePick from "../../../../component/fiepick";
 import ImagePick from "../../../../component/imagepick";
import React, { useState, useEffect } from "react";
import { db, FirebaseApp } from "../../../../config/firebase";
import router from "next/router";

const Hasil = () => {
  const toast = useToast();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedFile, setSelectedFile] = useState<any>(undefined);
  const [selectedImage, setSelectedImage] = useState<any>(undefined);
  const [previewImage, setPreviewImage] = useState<any>(
    "https://via.placeholder.com/150"
  );
  const [preview, setPreview] = useState<any>(
    "https://via.placeholder.com/150"
  );
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
        .doc(`data-mahasiswa/${topik[0]}`).collection("hasil").doc(`${topik[1]}`)
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

  const onSelectFile = (e: (EventTarget & HTMLInputElement) | null) => {
    if (!e?.files) return;
    if (e.files[0]) {
      setSelectedFile(e.files[0]);
      let readerFile = new FileReader();
      readerFile.addEventListener("load", () => {
        setPreview(readerFile.result);
      });
      readerFile.readAsDataURL(e.files[0]);
    }
  };
  const onSelectImage = (ee: (EventTarget & HTMLInputElement) | null) => {
    if (!ee?.files) return;
    if (ee.files[0]) {
      setSelectedImage(ee.files[0]);
      let readerImage = new FileReader();
      console.log(readerImage)
      readerImage.addEventListener("load", () => {
        stateMhs.imgUrl="";
        setPreviewImage(readerImage.result);
      });
      readerImage.readAsDataURL(ee.files[0]);
    }
  };
  
  const onSubmitBerkas = async (id: string) => {
    setLoading(true);
    const metadata = {
      contentType: "application/docx",
    };
    const metadataImage = {
        contentType: "image/jpeg",
      };

    const snapshot = await FirebaseApp.storage()
      .ref()
      .child(
        `/file/proposal/${new Date().toISOString().substring(0, 10)}-proposal-${
          state.nim
        }.docx`
      )
      .put(selectedFile, metadata);

    const snapshotImage = await FirebaseApp.storage()
      .ref()
      .child(
        `/file/proposal/${new Date().toISOString().substring(0, 10)}-proposal-${
          state.nim
        }.png`
      )
      .put(selectedImage, metadataImage);

     const fileUrl = await snapshot.ref.getDownloadURL();
     const imageUrl = await snapshotImage.ref.getDownloadURL();

    await db
      .doc(`data-mahasiswa/${topik[0]}/proposal/${id}`)
      .update({...stateMhs, fileUrl: fileUrl, imgUrl: imageUrl })
      .then(() => {
        toast({
          description: "Unggah Berkas Berhasil",
          status: "success",
        });
        onClose();
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
      });
      onClose();
    setLoading(false);
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
        <>
        <InputGroup mt={2}>
        <InputLeftAddon children='Tanggal Bimbingan' />
        <Input type='tel' placeholder=''   value={stateMhs.tglBimbingan} 
        />
        </InputGroup>
        <InputGroup mt={2}>
        <InputLeftAddon children='Topik Bahasan' />
        <Input type='tel' placeholder=''   value={stateMhs.topikBahasan} 
        />
        </InputGroup>
        
      <InputGroup mt={2}>
        <InputLeftAddon children='Status Bimbingan' />
        <Select value={stateMhs.status}  placeholder='' >
        <option value='Belum Direview'>Belum Direview</option>
        <option value='Revisi'>Revisi</option>
       <option value='ACC'> ACC</option>
        </Select>
        </InputGroup>
      <InputGroup mt={2}>
        <InputLeftAddon children='Keterangan' />
        <Textarea onChange={(e) => setStateMhs((prev) => ({ ...prev, keterangan: e.target.value }))} value={stateMhs.keterangan} placeholder='Tulis keterangan'></Textarea>
        </InputGroup>
        
      </>
        
    </Container>
    <Container>
      <Text >Unggah Berkas</Text>
        <FilePick
          onChange={(e) => onSelectFile(e.target)}
        />
        <Text mt={4} >Unggah Media</Text>
        <ImagePick
          imageUrl={stateMhs.imgUrl == "" ? previewImage : stateMhs.imgUrl }
          onChange={(ee) => {onSelectImage(ee.target)}}
        />
        <VStack align={"end"}>
        <HStack align={"end"}>
        <Button
          mt={4}
          colorScheme={"green"}
          isLoading={loading}
        onClick={onOpen}
        >
          Kirim
        </Button>
        <Modal
       isOpen={isOpen}
       onClose={onClose}
         >
        <ModalOverlay />
       <ModalContent>
        <ModalHeader>Unggah Berkas?</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={() => onSubmitBerkas(stateMhs.id)}>
            Kirim
          </Button>
          <Button onClick={onClose}>Batal</Button>
        </ModalFooter>
       </ModalContent>
       </Modal>
        <Button
          mt={4}
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
