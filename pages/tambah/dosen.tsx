import { Container, Button, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { InputWihtText } from "../../component/InputText";
import { db } from "../../config/firebase";
import router from "next/router";

const Dosen = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    nip: "",
    nama: "",
    kontak: "",
    tanggallahir: "",
    email: "",
    password: "",
    isLogin: false,
    roles: "dosen",
    img_url:"",
    created_at: Date.now().toString(),
    updated_at: Date.now().toString(),
  });

  const onSubmit = async () => {
    setLoading(true);
    try {
      await db
        .doc(`data-dosen/${state.nip}`)
        .get()
        .then((docs) => {
          if (docs.exists) {
            toast({
              description: "nip telah terdaftar",
              status: "error",
            });
            setLoading(false);
            return;
          } else {
            db.doc(`data-dosen/${state.nip}`).set(state);
            toast({
              description: "Tambah Data Sukses",
              status: "success",
            });
            setLoading(false);
            return;
          }
        });
        router.push(`/datadosen`)
    } catch (error: any) {
      setLoading(false);
      toast({
        description: "Gagal tambahkan data",
        status: "error",
      });
    }
    setLoading(false);
  };
  return (
    <Container maxW={"container.xl"}>
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
      <InputWihtText
        title="Password"
        value={state.password}
        onChange={(e) =>
          setState((prev) => ({ ...prev, password: e.target.value }))
        }
      />
      
      <Button
        colorScheme={"green"}
        color={"white"}
        mt={10}
        onClick={onSubmit}
        isLoading={loading}
      >
        Tambah
      </Button>
    </Container>
  );
};

export default Dosen;
