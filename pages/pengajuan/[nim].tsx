import React, { useEffect, useState } from "react";
import router from "next/router";
import { db } from "../../config/firebase";
import { Container, Button, useToast, Textarea, Text } from "@chakra-ui/react";
import { InputWihtText } from "../../component/InputText";

const AjukanJudul = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState({
    nim:"",
    judul:{"judul":"", "abstrak":""}
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

  const onSubmit = async (nim: string) => {
    setLoading(true);
    await db
      .doc(`data-mahasiswa/${nim}`)
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
        title="Judul"
        value={state.judul.judul}
        onChange={(e) => setState((prev) => ({ ...prev, judul: {judul: e.target.value, abstrak: state.judul.abstrak} }))}
      />
      <div>
      <Text mt="8" mb='8px'>Abstrak</Text>
      <Textarea
        value={state.judul.abstrak}
        onChange={(e) =>
          setState((prev) => ({ ...prev, judul: {judul: state.judul.judul, abstrak: e.target.value} }))}
        placeholder='Here is a sample placeholder'
        size='sm'
        height={"200px !important"}
        width={"35%"}
      />
    </div>
      <Button
        colorScheme={"green"}
        color={"white"}
        mt={10}
        isLoading={loading}
        onClick={() => onSubmit(state.nim)}
      >
        Update
      </Button>
    </Container>
  );
};

export default AjukanJudul;
