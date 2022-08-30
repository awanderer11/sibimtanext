import {
  Box,
  Table,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
  useToast,
  IconButton,
} from "@chakra-ui/react";
import { FiDownload } from "react-icons/fi";
import { Checkbox } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import router from "next/router";
import { db } from "../../../config/firebase";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
const Proposal = () => {
  const [state, setState] = useState({
    nim: "",
    nama: "",
    judul: { judul: "", url: "" },
    tahunmasuk: "",
    pembimbing1: { nama: "", nip: "" },
    pembimbing2: { nama: "", nip: "" },
    sempro: false,
    semhas: false,
    semtutup: false,
    yudisium: false,
    updated_at: Date.now().toString(),
  });
  const toast = useToast();
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

  function loadImageAsDataURL(url: string) {
    return new Promise<string>((resolve, reject) => {
      var img = new Image();
      img.onload = function () {
        var canvas = document.createElement("canvas");
        var ctx = canvas.getContext("2d");
        ctx!.drawImage(img, 0, 0);
        resolve(canvas.toDataURL());
      };
      img.onerror = reject;
      img.src = url;
    });
  }

  const onDownload = async () => {
    const doc = new jsPDF();
    const head = [["Semhas", "Sempro", "Tutup", "Yudisium"]];
    const body: any = [["Selesai", "Selesai", "Selesai", "Selesai"]];

    // var img = new Image();
    // img.src = "../../../assets/logo.png";
    // img.onload = function () {
    //   var canvas = document.createElement("canvas");
    //   var ctx = canvas.getContext("2d");
    //   ctx!.drawImage(img, 0, 0);
    //   doc.addImage(img, "PNG", 15, 15, 195, 100);
    // };
    // var niceimage = new Image();
    // // niceimage.src = "../../../assets/logo.png";
    // niceimage.src = path.resolve("../../../assets/logo.png");
    // niceimage.onload = function () {
    //   doc.addImage(niceimage, "png", 15, 15, 195, 100);
    // };

    doc.text("Laporan Bimbingan Online", 70, 15);
    doc.setFontSize(12);
    doc.text(
      "Teknologi Pendidikan Fakultas Ilmu Pendidikan Universitas Negeri Makassar",
      30,
      20
    );
    doc.line(15, 22, 195, 22);
    doc.text("Nim", 15, 30);
    doc.text(": " + state.nim, 50, 30);
    doc.text("Nama", 15, 35);
    doc.text(": " + state.nama, 50, 35);
    doc.text("Tahun Masuk", 15, 40);
    doc.text(": " + state.tahunmasuk, 50, 40);
    doc.text("Judul", 15, 45);
    var judul = doc.splitTextToSize(": " + state.judul.judul, 140);
    doc.text(judul, 50, 45);

    autoTable(doc, {
      head: [["Nip Pembimbing 1", "Nama Pembimbing 1"]],
      body: [[state.pembimbing1.nip, state.pembimbing1.nama]],
      margin: { top: 60 },
    });

    autoTable(doc, {
      head: [["Nip Pembimbing 2", "Nama Pembimbing 2"]],
      body: [[state.pembimbing2.nip, state.pembimbing2.nama]],
    });

    autoTable(doc, {
      head: head,
      body: body,
    });
    doc.save("laporan.pdf");
  };

  if (!state) return <Text>Loading...</Text>;

  return (
    <Box>
      <Table variant="striped" size={"sm"} mt={5}>
        <Thead>
          <Tr>
            <Th>NIM</Th>
            <Th>Nama</Th>
            <Th>SEMPRO</Th>
            <Th>SEMHAS</Th>
            <Th>TUTUP</Th>
            <Th>Yudisium</Th>
            <Th>Unduh Laporan</Th>
          </Tr>
        </Thead>
        <Tbody>
          <Tr>
            <Td>{state.nim}</Td>
            <Td>{state.nama}</Td>
            <Td>
              <Checkbox isChecked={state.sempro} isDisabled></Checkbox>
            </Td>
            <Td>
              <Checkbox isChecked={state.semhas} isDisabled></Checkbox>
            </Td>
            <Td>
              <Checkbox isChecked={state.semtutup} isDisabled></Checkbox>
            </Td>
            <Td>
              <Checkbox isChecked={state.yudisium} isDisabled></Checkbox>
            </Td>
            <Td>
              <IconButton
                aria-label="icon"
                icon={<FiDownload />}
                onClick={onDownload}
                isDisabled={state.yudisium == false ? true : false}
              />
            </Td>
          </Tr>
        </Tbody>
      </Table>
    </Box>
  );
};

export default Proposal;
