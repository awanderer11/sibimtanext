import React, { useEffect, useState } from "react";
import router from "next/router";
import { db } from "../../../config/firebase";
import { Container, Button, useToast } from "@chakra-ui/react";
import { InputWihtText } from "../../../component/InputText";

const EditMahasiswa = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    id: "",
    tahun: "",
    judul: "",
    updated_at: Date.now().toString(),
  });

  useEffect(() => {
    async function fetch() {
      await db
        .doc(`judulskripsi/${router.query.id}`)
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

  const onSubmit = async (id: string) => {
    setLoading(true);
    await db
      .doc(`judulskripsi/${id}`)
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
        title="Tahun"
        value={state.tahun}
        onChange={(e) =>
          setState((prev) => ({ ...prev, tahun: e.target.value }))
        }
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
        isLoading={loading}
        onClick={() => onSubmit(state.id)}
      >
        Update
      </Button>
    </Container>
  );
};

export default EditMahasiswa;
