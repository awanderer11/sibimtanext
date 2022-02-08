import { Container, Button, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { InputWihtText } from "../../component/InputText";
import { db, auth } from "../../config/firebase";

const Mahasiswa = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    nim: "",
    nama: "",
    tahunmasuk: "",
    email: "",
    password: "",
    judul: {"abstrak":"","judul": ""},
    pembimbing1: {"nip":"","nama": ""},
    pembimbing2: {"nip":"","nama": ""},
    proposal: "",
    hasil: "",
    tutup: "",
    sempro: false,
    semhas: false,
    semtutup: false,
    yudisium: false,
    isLogin: false,
    roles: "mahasiswa",
    created_at: Date.now().toString(),
    updated_at: Date.now().toString(),
  });

  const onSubmit = async () => {
    setLoading(true);
    try {
  //    await auth
  //   .createUserWithEmailAndPassword(state.email, "qwert1234")
  //   .then((response) => {
  //    console.log(response)
  //   })
  // .catch((error) => {
  //  return { error };
  // });
      await db
        .doc(`data-mahasiswa/${state.nim}`)
        .get()
        .then((docs) => {
          if (docs.exists) {
            toast({
              description: "nim telah terdaftar",
              status: "error",
            });
            setLoading(false);
            return;
          } else {
            db.doc(`data-mahasiswa/${state.nim}`).set(state);
            toast({
              description: "Tambah Data Sukses",
              status: "success",
            });
            setLoading(false);
            return;
          }
        });
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

export default Mahasiswa;
