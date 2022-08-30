import React, { useEffect, useState } from "react";
import router from "next/router";
import { db } from "../../../config/firebase";
import { Container, Button, useToast } from "@chakra-ui/react";
import { InputWihtText } from "../../../component/InputText";

const EditDosen = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    nip: "",
    nama: "",
    kontak: "",
    email: "",
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

  const onSubmit = async (nip: string) => {
    setLoading(true);
    await db
      .doc(`data-dosen/${nip}`)
      .update(state)
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
        isLoading={loading}
        onClick={() => onSubmit(state.nip)}
      >
        Update
      </Button>
    </Container>
  );
};

export default EditDosen;
