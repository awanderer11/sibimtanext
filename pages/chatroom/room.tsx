import React, { useEffect, useState } from "react";
import { auth, db } from "../../config/firebase";
import {
  Container,
  Button,
  useToast,
  Box,
  HStack,
  Avatar,
  VStack,
  Textarea,
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftAddon,
  Select,
  Text,
} from "@chakra-ui/react";
import { InputWihtText } from "../../component/InputText";
import router from "next/router";

const Room = () => {
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<any[]>([]);
  const [valMessage, setValMessage] = useState("");
  const [mhs, setMhs] = useState({
    nim: "",
    nama: "",
    email: "",
    kontak: "",
    tahunmasuk: "",
    pembimbing2: { nip: "", nama: "" },
    judul: { abstrak: "", judul: "" },
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

  useEffect(() => {
    async function fetch() {
      db.collection("chat").onSnapshot((v) => {
        const data: any[] = [];
        v.forEach((vv) => {
          data.push({ ...vv.data() });
        });
        setState(data);
      });
    }
    fetch();
  }, []);

  const onSubmit = async () => {
    setLoading(true);
    await db
      .collection(`chat`)
      .add({ username: auth.currentUser?.email, message: valMessage })
      .then(() => {
        toast({
          description: "Post Berhasil",
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
    <SimpleGrid columns={2} spacing={10}>
      <Container maxW={"container.xl"}>
        <Textarea
          value={valMessage}
          onChange={(e) => setValMessage(e.target.value)}
          placeholder=""
          size="sm"
          height={"200px !important"}
        />
        <div>
          <VStack align={"end"}>
            <Button
              colorScheme={"green"}
              color={"white"}
              mt={2}
              isLoading={loading}
              onClick={() => onSubmit()}
            >
              Post
            </Button>
          </VStack>
        </div>
      </Container>
      <Container>
        <Box>
          <InputGroup>
            <InputLeftAddon children="Nim" />
            <Input type="tel" placeholder="" disabled />
          </InputGroup>
          <InputGroup mt={2}>
            <InputLeftAddon children="Nama" />
            <Input type="tel" placeholder="" disabled />
          </InputGroup>
          <InputGroup mt={2}>
            <InputLeftAddon children="Kontak" />
            <Input type="tel" placeholder="" disabled />
          </InputGroup>
          <InputGroup mt={2}>
            <InputLeftAddon children="Email" />
            <Input type="tel" placeholder="" disabled />
          </InputGroup>
          <InputGroup mt={2}>
            <InputLeftAddon children="Tahun Masuk" />
            <Input type="tel" placeholder="" disabled />
          </InputGroup>
          <InputGroup mt={2}>
            <InputLeftAddon children="Pembimbing 2" />
            <Select placeholder="Pilih Pembimbing 2">
              <option value="option1">Option 1</option>
              <option value="option2">Option 2</option>
              <option value="option3">Option 3</option>
            </Select>
          </InputGroup>
          <InputWihtText title="Judul" />
          <Text mt="2">Abstrak</Text>
          <Textarea></Textarea>
          <Button mt={2}>Terima Judul</Button>
        </Box>
      </Container>
    </SimpleGrid>
  );
};

export default Room;
