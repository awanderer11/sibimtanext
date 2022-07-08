import type { NextPage } from 'next'
import { 
  useToast,
  SimpleGrid, 
  Button,
  HStack,
} from "@chakra-ui/react";
import FilePick from "../../component/fiepick";
import React, { useState, useEffect } from "react";
import { db, FirebaseApp } from "../../config/firebase";
import { InputWihtText } from "../../component/InputText";
import router from "next/router";

const Administrasi: NextPage = () => {
  const toast = useToast();
  const [selectedFile, setSelectedFile] = useState<any>(undefined);
  const [preview, setPreview] = useState<any>(
    "https://via.placeholder.com/150"
  );
  const [loading, setLoading] = useState(false);
  const [stateb, setStateb] = useState({
    id: Date.now().toString(),
    fileName: "",
    fileUrl:"",
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

  const onSubmitBerkas = async () => {
    setLoading(true);
   if(stateb.fileName !="" && preview != ""){
    const metadata = {
      contentType: "application/docx",
    };
    const snapshot = await FirebaseApp.storage()
      .ref()
      .child(
        `/file/administrasi/${Date.now().toString()}-administrasi.docx`
      )
      .put(selectedFile, metadata);
      const fileUrl = await snapshot.ref.getDownloadURL();
      if(fileUrl != ""){
      await db
      .doc(`administrasi/${stateb.id}`)
      .get()
      .then((docs) => {
        if (docs.exists) {
          toast({
            description: "file telah terdaftar",
            status: "error",
          });
          setLoading(false);
          return;
        } else {
          db.doc(`administrasi/${stateb.id}`).set(stateb);
          toast({
            description: "Tambah Data Sukses",
            status: "success",
          });
          setLoading(false);
          router.push(`/administrasi`)
        }
      });
     
    }
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
        onClick={()=>onSubmitBerkas()}
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
    </SimpleGrid>
    </div>
  )
}

export default Administrasi
