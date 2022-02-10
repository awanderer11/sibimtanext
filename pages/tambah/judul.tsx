import { Container, Button, useToast } from "@chakra-ui/react";
import React, { useState } from "react";
import { InputWihtText } from "../../component/InputText";
import { db } from "../../config/firebase";
import router from "next/router";

const Judul = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    id: "",
    tahun: "",
    judul: "",
    created_at: Date.now().toString(),
    updated_at: Date.now().toString(),
  });

  const onSubmit = async () => {
    setLoading(true);
    console.log(state)
    try {
      await db
        .doc(`judulskripsi/${state.id}`)
        .get()
        .then((docs) => {
          if (docs.exists) {
            toast({
              description: "id telah terdaftar",
              status: "error",
            });
            setLoading(false);
            return;
          } else {
            db.doc(`judulskripsi/${state.id}`).set(state);
            toast({
              description: "Tambah Data Sukses",
              status: "success",
            });
            setLoading(false);
            return;
          }
        });
        router.push(`/judulskripsi`)
    } catch (error: any) {
      setLoading(false);
      toast({
        description: error.code,
        status: "error",
      });
    }
    setLoading(false);
  };

 
  return (
    <Container maxW={"container.xl"}>
      <InputWihtText
        title="ID"
        value={state.id}
        onChange={(e) => setState((prev) => ({ ...prev, id: e.target.value }))}
      />
      <InputWihtText
        title="Tahun"
        value={state.tahun}
        onChange={(e) => setState((prev) => ({ ...prev, tahun: e.target.value }))}
      />
      <InputWihtText
        title="Judul"
        value={state.judul}
        onChange={(e) =>
          setState((prev) => ({ ...prev, judul: e.target.value }))
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

export default Judul;
