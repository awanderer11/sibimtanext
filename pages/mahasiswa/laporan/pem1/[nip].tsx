import { Container, Button, useToast,Text, InputGroup, Input,InputLeftAddon, SimpleGrid, VStack  } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { InputWihtText } from "../../../../component/InputText";
import { db, FirebaseApp } from "../../../../config/firebase";
import router from "next/router";
import ImagePick from "../../../../component/imagepick";

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
    if(preview === "https://via.placeholder.com/150"){ 
      await db
      .doc(`data-mahasiswa/${nim}`)
      .update({...state, img_url: state.img_url})
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
    return;
    }
    else{
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
            description: "Update Foto Berhasil",
            status: "success",
          });
          setLoading(false);
        })
        .catch((e) => {
          console.log(e);
        });
      setLoading(false);
      return;
    }
   
  };


  return (
    <SimpleGrid columns={2} spacing={10}>
    <Container maxW={"container.xl"}>
      <Text>FOTO</Text>
      <ImagePick
          imageUrl={state.img_url == "" ? preview : state.img_url }
          onChange={(e) => onSelectFile(e.target)}
        />
      <InputGroup mt={2}>
        <InputLeftAddon children='NIM' />
        <Input type='tel' placeholder='' disabled value={state.nim} 
        onChange={(e) => setState((prev) => ({ ...prev, nip: e.target.value }))}
        />
        </InputGroup>
      <InputGroup mt={2}>
        <InputLeftAddon children='Nama' />
        <Input type='tel' placeholder=''  value={state.nama} 
        onChange={(e) =>
          setState((prev) => ({ ...prev, nama: e.target.value }))
        }
        />
        </InputGroup>
      <InputGroup mt={2}>
        <InputLeftAddon children='Tanggal Lahir' />
        <Input type='tel' placeholder=''  value={state.tanggallahir} 
        onChange={(e) =>
          setState((prev) => ({ ...prev, tanggallahir: e.target.value }))
        }
        />
        </InputGroup>
      <InputGroup mt={2}>
        <InputLeftAddon children='Tahun Masuk' />
        <Input type='tel' placeholder=''  value={state.tahunmasuk} 
        onChange={(e) =>
          setState((prev) => ({ ...prev, tahunmasuk: e.target.value }))
        }
        />
        </InputGroup>
      <InputGroup mt={2}>
        <InputLeftAddon children='Email' />
        <Input type='tel' placeholder=''  disabled value={state.email} 
        onChange={(e) =>
          setState((prev) => ({ ...prev, email: e.target.value }))
        }
        />
        </InputGroup>
      <InputGroup mt={2}>
        <InputLeftAddon children='Alamat' />
        <Input type='tel' placeholder=''  value={state.alamat} 
        onChange={(e) =>
          setState((prev) => ({ ...prev, alamat: e.target.value }))
        }
        />
        </InputGroup>
      <InputGroup mt={2}>
        <InputLeftAddon children='Kontak' />
        <Input type='tel' placeholder=''  value={state.kontak} 
        onChange={(e) =>
          setState((prev) => ({ ...prev, kontak: e.target.value }))
        }
        />
        </InputGroup>
      <InputGroup mt={2}>
        <InputLeftAddon children='Jenis Kelamin' />
        <Input type='tel' placeholder=''  value={state.jeniskelamin} 
        onChange={(e) =>
          setState((prev) => ({ ...prev, jeniskelamin: e.target.value }))
        }
        />
        </InputGroup>
      <InputGroup mt={2}>
        <InputLeftAddon children='Agama' />
        <Input type='tel' placeholder=''  value={state.agama} 
        onChange={(e) =>
          setState((prev) => ({ ...prev, agama: e.target.value }))
        }
        />
        </InputGroup>
      <VStack align={"end"}>
      <Button
        colorScheme={"green"}
        color={"white"}
        mt={10}
        onClick={() => onSubmit(state.nim)}
        isLoading={loading}
      >
        Simpan
      </Button>
      </VStack>
    </Container>
    </SimpleGrid>
  );
};

export default MyProfile;
