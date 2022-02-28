import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ChakraProvider, theme } from '@chakra-ui/react';

function MyApp({ Component, pageProps }: AppProps) {
  return <ChakraProvider theme={theme}>
    <Component {...pageProps} />
  </ChakraProvider>;
}

export default MyApp