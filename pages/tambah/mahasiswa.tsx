import { Container, Button, useToast, Select } from "@chakra-ui/react";
import React, { useState, useEffect } from "react";
import { InputWihtText } from "../../component/InputText";
import { db, auth } from "../../config/firebase";
import router from "next/router";

const Mahasiswa = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [dosen, setDosen] = useState<any[]>([]);
  const [state, setState] = useState({
    nim: "",
    nama: "",
    tanggallahir: "",
    tahunmasuk: "",
    alamat: "",
    kontak: "",
    jeniskelamin: "",
    agama: "",
    email: "",
    password: "",
    judul:{"judul":"", "created_at":"", "updated_at":"", "url":""},
    pembimbing1: {"nip":"","nama": ""},
    pembimbing2: {"nip":"","nama": ""},
    nip1:"",
    nip2:"",
    proposal: "",
    hasil: "",
    tutup: "",
    sempro: false,
    semhas: false,
    semtutup: false,
    yudisium: false,
    isLogin: false,
    img_url:"",
    roles: "mahasiswa",
    created_at: Date.now().toString(),
    updated_at: Date.now().toString(),
  });

  useEffect(() => {
    async function fetch() {
      db.collection('data-dosen').onSnapshot((v) => {
        const data: any[]= []
        v.forEach((vv) => {
          data.push({...vv.data()})
        })
        setDosen(data)
      })
    }
    fetch();
  }, []);

  const onSubmit = async () => {
    setLoading(true);
    console.log(state)
    try {
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
        router.push(`/datamahasiswa`)
    } catch (error: any) {
      setLoading(false);
      toast({
        description: error.code,
        status: "error",
      });
    }
    setLoading(false);
  };

  const onChangeValue = (e: React.ChangeEvent<HTMLSelectElement>) => {
    if(e.target.value !== "Pilih Pembimbing 1"){
      const parseJosn = JSON.parse(e.target.value)
       setState((prev) => ({ ...prev, pembimbing1: { nip: parseJosn.nip, nama: parseJosn.nama }, nip1: parseJosn.nip }));
    }
    return;
  }

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
      <Select mt="4" align={"start"} width={"400px"} onChange={(e) => onChangeValue(e)} placeholder='Pilih Pembimbing 1' >
        {dosen.map((it,id)=> <option key={id} defaultValue={JSON.stringify(it)} value={JSON.stringify(it)}>{it.nip +" "+it.nama}</option>)}
      </Select>
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
