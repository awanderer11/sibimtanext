import { Container, Button, useToast } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { InputWihtText } from "../../../component/InputText";
import { db, FirebaseApp } from "../../../config/firebase";
import router from "next/router";
import ImagePick from "../../../component/imagepick";

const MyProfile = () => {
  const toast = useToast();
  const [preview, setPreview] = useState<any>(
    "https://via.placeholder.com/150"
  );
  const [selectedFile, setSelectedFile] = useState<any>(undefined);
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    nip: "",
    nama: "",
    kontak: "",
    email: "",
    img_url:"",
    updated_at: Date.now().toString(),
  });
  useEffect(() => {
    async function fetch() {
      await db
        .doc(`data-dosen/${router.query.nip}`)
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
        state.img_url="";
        setPreview(reader.result);
      });
      reader.readAsDataURL(e.files[0]);
    }
  };

const onSubmit = async (nip: string) => {
    setLoading(true);
    const metadata = {
      contentType: "image/jpeg",
    };

    const snapshot = await FirebaseApp.storage()
      .ref()
      .child(
        `/images/${new Date().toISOString().substring(0, 10)}-${
          state.nip
        }`
      )
      .put(selectedFile, metadata);

     const imageUrl = await snapshot.ref.getDownloadURL();

    await db
      .doc(`data-dosen/${nip}`)
      .update({...state, img_url: imageUrl,})
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
    <Container maxW={"container.xl"}>
      <ImagePick
          imageUrl={state.img_url == "" ? preview : state.img_url }
          onChange={(e) => onSelectFile(e.target)}
        />
      <InputWihtText
        title="NIP"
        value={state.nip}
        onChange={(e) => setState((prev) => ({ ...prev, nip: e.target.value }))}
      />
      <InputWihtText
        title="Nama"
        value={state.nama}
        onChange={(e) =>
          setState((prev) => ({ ...prev, nama: e.target.value }))
        }
      />
      <InputWihtText
        title="Kontak"
        value={state.kontak}
        onChange={(e) =>
          setState((prev) => ({ ...prev, kontak: e.target.value }))
        }
      />
      <InputWihtText
        title="Email"
        value={state.email}
        onChange={(e) =>
          setState((prev) => ({ ...prev, email: e.target.value }))
        }
      />
      <Button
        colorScheme={"green"}
        color={"white"}
        mt={10}
        onClick={() => onSubmit(state.nip)}
        isLoading={loading}
      >
        Simpan
      </Button>
    </Container>
  );
};

export default MyProfile;
