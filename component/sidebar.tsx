/* eslint-disable react/no-children-prop */
import {
    useDisclosure,
    Flex,
    useColorModeValue,
    Icon,
    Box,
    Drawer,
    DrawerOverlay,
    DrawerContent,
    IconButton,
    Text,
    Avatar,
    HStack,
    Spacer,
    VStack,
    Button,
    Divider,
  } from "@chakra-ui/react";
  import { ReactNode, useEffect, useState } from "react";
  import router from "next/router";
  import { FiMenu, FiUsers, FiUser } from "react-icons/fi";
  import{BsBookHalf, BsFillBookmarkFill, BsFillChatLeftQuoteFill, BsFillChatSquareTextFill, BsFillBookFill, BsFillBookmarksFill, BsFillGridFill} from "react-icons/bs";
  
  import { auth, db } from "../config/firebase";
  
  interface SidebarContentProps {
    children: ReactNode;
  }
  
  export default function SidebarContents(props: SidebarContentProps) {
    const sidebar = useDisclosure();
    const [roles, setRoles] = useState("")
    const [nim, setnim] = useState("")
    const [nip, setnip] = useState("")

    useEffect(() => {
          async function fetch() {
            let roles = ''
            let nim = ''
            let nip = ''
              db.collection(`/data-mahasiswa`).where('email', '==', auth.currentUser?.email).get().then((docs) => {
                if(docs.empty) {
                  db.collection('/data-dosen').where('email', '==', auth.currentUser?.email).get().then((v) => {
                      v.forEach((b) => {
                        roles = b.data().roles
                        nip = b.data().nip
                        setRoles(b.data().roles)
                        setnip(b.data().nip)
                      })
                  })
                  return;
                }
                docs.forEach((vv) => {
                  roles = vv.data().roles
                  nim = vv.data().nim
                  setRoles(vv.data().roles)
                  setnim(vv.data().nim)
                  
                })
              })
          }
          fetch()
    },[])
  
    const NavItem = (props: any) => {
      const { icon, children, ...rest } = props;
      return (
        <Flex
          align="center"
          px="4"
          pl="4"
          py="3"
          cursor="pointer"
          color={"gray.50"}
          _hover={{
            bg: useColorModeValue("gray.100", "gray.900"),
            color: useColorModeValue("gray.900", "gray.200"),
          }}
          role="group"
          fontSize={"16px"}
          fontWeight="semibold"
          onClick={() => router.push(props.link)}
          transition=".15s ease"
          {...rest}
        >
          {icon && <Icon mx="2" boxSize="4" as={icon} fontSize={"20px"} />}
          {children}
        </Flex>
      );
    };
  
    const SidebarContent = (props: any) => (
      <Box
        as="nav"
        shadow={"xl"}
        pos="fixed"
        top="0"
        left="0"
        zIndex="sticky"
        h="full"
        pb="10"
        overflowX="hidden"
        overflowY="auto"
        bg="#12B2B3"
        borderColor="blackAlpha.300"
        borderRightWidth="1px"
        w="60"
        {...props}
      >
        <VStack px="4" py="5" align="center">
          {/* <Logo /> */}
          <Text fontSize="2xl" ml="2" color={"gray.50"} fontWeight="bold">
            SIBIMTA
          </Text>
          <Divider />
        </VStack>
        <Flex
          direction="column"
          as="nav"
          fontSize="sm"
          color="gray.600"
          aria-label="Main Navigation"
        >
          {auth.currentUser?.email === 'sibimta@email.com' && (
              <>
          <NavItem icon={BsFillGridFill} link="/dashboard">
            Dashboard
          </NavItem>
          <Divider />
          <NavItem icon={FiUsers} link="/datamahasiswa">
            Data Mahasiswa
          </NavItem>
          <Divider />
          <NavItem icon={FiUsers} link="/datadosen">
            Data Dosen
          </NavItem>
          <Divider />
          <NavItem icon={BsFillChatLeftQuoteFill} link="/pengajuanjudul">
            Pengajuan Judul
          </NavItem>
          <Divider />
          <NavItem icon={BsBookHalf} link="/bimbinganjudul">
            Bimbingan Judul
          </NavItem>
          <Divider />
          <NavItem icon={BsFillBookmarkFill} link="/proposal">
            Proposal
          </NavItem>
          <NavItem icon={BsFillBookmarkFill} link="/hasil">
            Hasil
          </NavItem>
          <NavItem icon={BsFillBookmarkFill} link="/tutup">
            Tutup
          </NavItem>
          <Divider />
          <NavItem icon={BsFillChatSquareTextFill} link="/laporan">
            Laporan
          </NavItem>
          <Divider />
          <NavItem icon={BsFillBookFill} link="/judulskripsi">
            Judul Skripsi
          </NavItem>
          <Divider />
          <NavItem icon={BsFillBookmarksFill} link="/administrasi">
            Administrasi
          </NavItem>
          <Divider />
              </>
          )}

          {roles === 'dosen' && (
              <>
          <NavItem icon={BsFillGridFill} onClick={() => router.push(`/dashboard/dosen/${nip}`)}>
            Dashboard
          </NavItem>
          <Divider />
          <NavItem icon={FiUser} onClick={() => router.push(`/myprofile/dosen/${nip}`)}>
              My Profile
            </NavItem>
            <Divider />
          <NavItem icon={BsBookHalf} link="/bimbinganjudul">
            Bimbingan Judul
          </NavItem>
          <Divider />
          <NavItem icon={BsFillBookmarkFill} link="/proposal">
            Proposal
          </NavItem>
          <NavItem icon={BsFillBookmarkFill} link="/hasil">
            Hasil
          </NavItem>
          <NavItem icon={BsFillBookmarkFill} link="/tutup">
            Tutup
          </NavItem>
          <Divider />
          <NavItem icon={BsFillChatSquareTextFill} link="/laporan">
            Laporan
          </NavItem>
          <Divider />
          <NavItem icon={BsFillBookFill} link="/view/judulskripsi">
            Judul Skripsi
          </NavItem>
          <Divider />
          <NavItem icon={BsFillBookmarksFill} link="/administrasi">
            Administrasi
          </NavItem>
          <Divider />
              </>
          )}    

          {roles === 'mahasiswa' && (
          <>
            <NavItem icon={BsFillGridFill} onClick={() => router.push(`/dashboard/mahasiswa/${nim}`)}>
              Dashboard
            </NavItem>
            <Divider />
            <NavItem icon={FiUser} onClick={() => router.push(`/myprofile/mhs/${nim}`)}>
              My Profile
            </NavItem>
            <Divider />
            <NavItem icon={BsFillChatLeftQuoteFill} onClick={() => router.push(`/mahasiswa/pengajuanjudul/${nim}`)}>
              Pengajuan Judul
            </NavItem>
            <Divider />
            <NavItem icon={BsFillBookmarkFill} onClick={() => router.push(`/mahasiswa/proposal/index/${nim}`)}>
              Proposal
            </NavItem>
            <NavItem icon={BsFillBookmarkFill} onClick={() => router.push(`/mahasiswa/hasil/index/${nim}`)}>
              Hasil
            </NavItem>
            <NavItem icon={BsFillBookmarkFill} onClick={() => router.push(`/mahasiswa/tutup/index/${nim}`)}>
              Tutup
            </NavItem>
            <Divider />
            <NavItem icon={BsFillChatSquareTextFill} onClick={() => router.push(`/mahasiswa/laporan/${nim}`)}>
              Laporan
            </NavItem>
            <Divider />
            <NavItem icon={BsFillBookFill} link="/view/judulskripsi">
              Judul Skripsi
            </NavItem>
            <Divider />
            <NavItem icon={BsFillBookmarksFill} link="/administrasi">
              Administrasi
            </NavItem>
            <Divider />
          </>
          )}
        </Flex>         
        <Flex pos={"absolute"} bottom={5} p={4}>
          <Button
            w={200}
            onClick={() => {
              auth.signOut();
              router.push(`/`)
            }}
          >
            Logout
          </Button>
        </Flex>
      </Box>
    );
  
    return (
      <Box
        as="section"
        bg={useColorModeValue("gray.50", "gray.700")}
        minH="100vh"
      >
        <SidebarContent display={{ base: "none", md: "unset" }} />
        <Drawer
          isOpen={sidebar.isOpen}
          onClose={sidebar.onClose}
          placement="left"
        >
          <DrawerOverlay />
          <DrawerContent>
            <SidebarContent w="full" borderRight="none" />
          </DrawerContent>
        </Drawer>
        <Box ml={{ base: 0, md: 60 }} transition=".3s ease">
          <Flex
            as="header"
            align="center"
            justify="space-between"
            w="full"
            px="4"
            py={8}
            bg={useColorModeValue("white", "gray.800")}
            borderBottomWidth="1px"
            borderColor={useColorModeValue("inherit", "gray.700")}
            h="14"
            shadow={"lg"}
          >
            <IconButton
              aria-label="Menu"
              display={{ base: "inline-flex", md: "none" }}
              onClick={sidebar.onOpen}
              icon={<FiMenu />}
              size="sm"
            />
            <Spacer />
            <HStack>
              <Text color="black">{auth.currentUser?.email}</Text>
              <Avatar name={String(auth.currentUser?.email)} />
            </HStack>
          </Flex>
  
          <Box as="main" p="4">
            {/* Add content here, remove div below  */}
            {props.children}
          </Box>
        </Box>
      </Box>
    );
  }
  