import type { NextPage } from 'next';
import Head from 'next/head';
import Image from 'next/image';
import styles from '../styles/Home.module.css';
import { useMemo, useState } from 'react';
import {
  ConnectionProvider,
  useWallet,
  WalletProvider,
} from '@solana/wallet-adapter-react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import {
  GlowWalletAdapter,
  LedgerWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  SolletExtensionWalletAdapter,
  SolletWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets';
import {
  WalletModalProvider,
  WalletDisconnectButton,
  WalletMultiButton,
  useWalletModal,
} from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import Market from '../components/market/Market';
import { QueryClient, QueryClientProvider } from 'react-query';
import { DiscordButton } from '../components/DiscordButton/DiscordButton';

// Default styles that can be overridden by your app
require('@solana/wallet-adapter-react-ui/styles.css');

const queryClient = new QueryClient();

const Home: NextPage = () => {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'.
  const network = WalletAdapterNetwork.Devnet;

  // You can also provide a custom RPC endpoint.
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);

  // @solana/wallet-adapter-wallets includes all the adapters but supports tree shaking and lazy loading --
  // Only the wallets you configure here will be compiled into your application, and only the dependencies
  // of wallets that your users connect to will be loaded.
  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({ network }),
      new TorusWalletAdapter(),
    ],
    [network]
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ConnectionProvider endpoint={endpoint}>
        <WalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            <div className={styles.container}>
              <Head>
                <title>METADRAGO DAO</title>
                <meta name='description' content='METADRAGO DAO' />
                <link rel='icon' href='/favicon.webp' />
              </Head>

              <header
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '10px 20px',
                  height: 100,
                }}
              >
                <a
                  aria-current='page'
                  href='/'
                  style={{ display: 'flex', alignItems: 'center' }}
                >
                  <img
                    src='/logo.png'
                    style={{
                      width: '50px',
                      height: '50px',
                      objectFit: 'contain',
                      marginRight: '10px',
                    }}
                  />
                  <h2 style={{ fontSize: 20, fontWeight: 400, margin: 0 }}>
                    MetaDrago
                    <br />
                    DAO
                  </h2>
                </a>
                <div style={{ display: 'flex' }}>
                  <DiscordButton />
                  {/* <WalletDisconnectButton /> */}
                  <WalletMultiButton />
                </div>
              </header>

              <main className={styles.main}>
                <Market />
              </main>

              <footer className={styles.footer}></footer>
            </div>
          </WalletModalProvider>
        </WalletProvider>
      </ConnectionProvider>
    </QueryClientProvider>
  );
};

export default Home;
