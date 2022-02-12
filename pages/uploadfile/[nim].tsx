import { Container, Button, useToast,Text, Image } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { db, FirebaseApp } from "../../config/firebase";
import router from "next/router";
import FilePick from "../../component/fiepick";
import { InputWihtText } from "../../component/InputText";

const UploadFile = () => {
  const toast = useToast();
  const [preview, setPreview] = useState<any>(
    "https://via.placeholder.com/150"
  );
  const [selectedFile, setSelectedFile] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    nim:"",
    judul:{"judul":"", "created_at":"", "updated_at":"", "url":""},
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

  const onSelectFile = (e: (EventTarget & HTMLInputElement) | null) => {
    if (!e?.files) return;
    if (e.files[0]) {
      setSelectedFile(e.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setPreview(reader.result);
      });
      reader.readAsDataURL(e.files[0]);
    }
  };

const onSubmit = async (nim: string) => {
    setLoading(true);
    const metadata = {
      contentType: "application/docx",
    };

    const snapshot = await FirebaseApp.storage()
      .ref()
      .child(
        `/file/${new Date().toISOString().substring(0, 7)}-${
          state.nim
        }.docx`
      )
      .put(selectedFile, metadata);

     const imageUrl = await snapshot.ref.getDownloadURL();

    await db
      .doc(`data-mahasiswa/${nim}`)
      .update({...state, judul:{judul: state.judul.judul, created_at:new Date().toLocaleDateString().substring(0, 10), updated_at:"", url: imageUrl }})
      .then(() => {
        toast({
          description: "Upload Judul Berhasil",
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
    <Container maxW={"container.xl"}>
         <InputWihtText
        title="Judul"
        value={state.judul.judul}
        onChange={(e) => setState((prev) => ({ ...prev, judul: {judul: e.target.value, created_at: state.judul.created_at, updated_at: state.judul.updated_at, url: state.judul.url}}))}
      />
      <Text mt={4}>Upload Berkas</Text>
      <FilePick
          onChange={(e) => onSelectFile(e.target)}
        />
      <Button
        colorScheme={"green"}
        color={"white"}
        mt={4}
        onClick={() => onSubmit(state.nim)}
        isLoading={loading}
      >
        Upload 
      </Button>
    </Container>
  );
};

export default UploadFile;
