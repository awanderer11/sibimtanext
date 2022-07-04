import '../styles/globals.css'
import type { AppProps } from 'next/app'
import dynamic from "next/dynamic";
import { ChakraProvider } from '@chakra-ui/react'
import Login from './login'
import { auth } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import Head from 'next/head';

const SidebarContents = dynamic(() => import("../component/sidebar"), {
  ssr: false,
});

function MyApp({ Component, pageProps }: AppProps) {
const [user, loading] = useAuthState(auth as any);
if (loading) return <span>Loading...</span>;
if (user) {
  return(
    <ChakraProvider resetCSS>
      
      <Head ><title>SIBIMTA</title></Head>
      <SidebarContents>
        <Component {...pageProps} />
      </SidebarContents>
    </ChakraProvider>
  )
}
return (
  <ChakraProvider resetCSS>
      <Head ><title>SIBIMTA</title></Head>
    <Login />
  </ChakraProvider>
); 
}

export default MyApp
