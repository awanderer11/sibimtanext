import type { NextPage } from 'next'
import { 
  useToast,
  SimpleGrid, 
  Button,
  HStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalHeader,
  ModalContent,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
} from "@chakra-ui/react";
import FilePick from "../../component/fiepick";
import React, { useState, } from "react";
import { db, FirebaseApp } from "../../config/firebase";
import { InputWihtText } from "../../component/InputText";
import router from "next/router";

const Administrasi: NextPage = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();
  const [selectedFile, setSelectedFile] = useState<any>(undefined);
  const [preview, setPreview] = useState<any>(
    "https://via.placeholder.com/150"
  );
  const [loading, setLoading] = useState(false);
  const [stateb, setStateb] = useState({
    id: Date.now().toString(),
    fileName: "",
    fileUrl: "",
    created_at: Date.now().toString(),
    updated_at: Date.now().toString(),
  });


  const onSelectFile = (e: (EventTarget & HTMLInputElement) | null) => {
    if (!e?.files) return;
    if (e.files[0]) {
      setSelectedFile(e.files[0]);
      let readerFile = new FileReader();
      console.log(readerFile)
      readerFile.addEventListener("load", () => {
        setPreview(readerFile.result);
      });
      readerFile.readAsDataURL(e.files[0]);
    }
  };

  const onSubmit = async () => {
    setLoading(true);
    console.log(stateb.fileName);
    console.log(selectedFile);
      if(stateb.fileName === "" ){
        toast({
          description: "Nama file tidak boleh kosong!",
          status: "error",
        });
      }else if(
        selectedFile === undefined
      ){
        toast({
          description: "File tidak boleh kosong!",
          status: "error",
        });
      }
      else{
        const metadata = {
          contentType: "application/docx",
        };
        const snapshot = await FirebaseApp.storage()
          .ref()
          .child(
            `/file/administrasi/${Date.now().toString()}-administrasi.docx`
          )
          .put(selectedFile, metadata);
          const url = await snapshot.ref.getDownloadURL();
            db.doc(`administrasi/${stateb.id}`).set({...stateb, fileUrl: url});
            toast({
              description: "Tambah Data Sukses",
              status: "success",
            });
            setLoading(false);
            router.push(`/administrasi`)
      }
  
  };
  return (
    <div>
    <SimpleGrid >
    <InputWihtText
        title="Nama File"
        value={stateb.fileName}
        onChange={(e) =>
          setStateb((prev) => ({ ...prev, fileName: e.target.value }))
        }
      />
      <HStack mt={4}>
      
     <FilePick
      onChange={(e) => onSelectFile(e.target)}
      />
      <Button
        mt={4}
        colorScheme={"green"}
        onClick={onOpen}
      >
         Simpan
     </Button>
     <Button
      mt={2}
          marginLeft={4}
          colorScheme={"green"}
        onClick={() => router.back()}
        >
          Kembali
        </Button>
      </HStack>
      <Modal
       isOpen={isOpen}
       onClose={onClose}
         >
        <ModalOverlay />
       <ModalContent>
        <ModalHeader>Tambah file?</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
        </ModalBody>
        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onSubmit}>
            Simpan
          </Button>
          <Button onClick={onClose}>Batal</Button>
        </ModalFooter>
       </ModalContent>
       </Modal>
    </SimpleGrid>
    </div>
  )
}

export default Administrasi
