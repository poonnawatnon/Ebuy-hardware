// import { ChakraProvider } from '@chakra-ui/react'
//mport { theme } from '@chakra-ui/react'
// import type { AppProps } from 'next/app'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
// import Layout from '../components/layout/Layout'
import { AuthProvider } from '../context/AuthContext'

import type { AppProps } from 'next/app'
import '../styles/globals.css'
import Layout from '../components/layout/Layout'
import { CartProvider } from '../context/CartContext'
import { Toaster } from 'react-hot-toast';


// Create a client
const queryClient = new QueryClient()

// Optional: Create a custom theme by extending the default theme
// const customTheme = {
//   ...theme,
//   colors: {
//     ...theme.colors,
//     brand: {
//       50: '#f7fafc',
//       100: '#edf2f7',
//       200: '#e2e8f0',
//       300: '#cbd5e0',
//       400: '#a0aec0',
//       500: '#718096',
//       600: '#4a5568',
//       700: '#2d3748',
//       800: '#1a202c',
//       900: '#171923',
//     },
//   },
//   fonts: {
//     ...theme.fonts,
//     body: 'Inter, system-ui, sans-serif',
//     heading: 'Inter, system-ui, sans-serif',
//   },
//   config: {
//     ...theme.config,
//     initialColorMode: 'light',
//     useSystemColorMode: false,
//   },
// }

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <CartProvider>
          <Layout>
            <Component {...pageProps} />
            <Toaster position="bottom-center" toastOptions={{
              duration:2000
            }}/>
          </Layout>
        </CartProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}
export default MyApp