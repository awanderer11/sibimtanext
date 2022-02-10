import React, { useEffect, useState } from "react";
import router from "next/router";
import { db } from "../../../config/firebase";
import { Container, Button, useToast } from "@chakra-ui/react";
import { InputWihtText } from "../../../component/InputText";

const EditMahasiswa = () => {
  const toast = useToast();
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
    updated_at: Date.now().toString(),
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
        isLoading={loading}
        onClick={() => onSubmit(state.nim)}
      >
        Update
      </Button>
    </Container>
  );
};

export default EditMahasiswa;
