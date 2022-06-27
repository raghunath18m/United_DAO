import React from 'react';
import '../styles/globals.css';
import Layout from '../components/Layout';
import { WalletConnectProvider } from '../Context/walletConnectContext';

function MyApp({ Component, pageProps }) {
  return (
    <WalletConnectProvider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </WalletConnectProvider>
  )
}

export default MyApp