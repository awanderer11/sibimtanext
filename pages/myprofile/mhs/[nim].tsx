import { Container, Button, useToast,Text, Image } from "@chakra-ui/react";
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
    nim: "",
    nama: "",
    tanggallahir: "",
    tahunmasuk: "",
    email: "",
    kontak: "",
    alamat: "",
    jeniskelamin: "",
    agama: "",
    img_url:"",
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

const onSubmit = async (nim: string) => {
    setLoading(true);
    const metadata = {
      contentType: "image/jpeg",
    };

    const snapshot = await FirebaseApp.storage()
      .ref()
      .child(
        `/images/${new Date().toISOString().substring(0, 10)}-${
          state.nim
        }`
      )
      .put(selectedFile, metadata);

     const imageUrl = await snapshot.ref.getDownloadURL();

    await db
      .doc(`data-mahasiswa/${nim}`)
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
      <Text>FOTO</Text>
      <ImagePick
          imageUrl={state.img_url == "" ? preview : state.img_url }
          onChange={(e) => onSelectFile(e.target)}
        />
      <InputWihtText
        title="NIM"
        value={state.nim}
        onChange={(e) => setState((prev) => ({ ...prev, nim: e.target.value }))}
      />
      <InputWihtText
        title="Nama"
        value={state.nama}
        onChange={(e) =>
          setState((prev) => ({ ...prev, nama: e.target.value }))
        }
      />
      <InputWihtText
        title="Tanggal Lahir"
        value={state.tanggallahir}
        onChange={(e) =>
          setState((prev) => ({ ...prev, tanggallahir: e.target.value }))
        }
      />
      <InputWihtText
        title="Tahun Masuk"
        value={state.tahunmasuk}
        onChange={(e) =>
          setState((prev) => ({ ...prev, tahunmasuk: e.target.value }))
        }
      />
      <InputWihtText
        title="Email"
        value={state.email}
        onChange={(e) =>
          setState((prev) => ({ ...prev, email: e.target.value }))
        }
      />
      <InputWihtText
        title="Alamat"
        value={state.alamat}
        onChange={(e) =>
          setState((prev) => ({ ...prev, alamat: e.target.value }))
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
        title="Jenis Kelamin"
        value={state.jeniskelamin}
        onChange={(e) =>
          setState((prev) => ({ ...prev, jeniskelamin: e.target.value }))
        }
      />
      <InputWihtText
        title="Agama"
        value={state.agama}
        onChange={(e) =>
          setState((prev) => ({ ...prev, agama: e.target.value }))
        }
      />
      <Button
        colorScheme={"green"}
        color={"white"}
        mt={10}
        onClick={() => onSubmit(state.nim)}
        isLoading={loading}
      >
        Simpan
      </Button>
    </Container>
  );
};

export default MyProfile;
