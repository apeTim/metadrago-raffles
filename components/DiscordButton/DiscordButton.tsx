import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import { useState } from 'react';
import styled from 'styled-components';
import Image from 'next/image';
import { useDiscord } from './DiscordButton.hooks';

const DiscordButtonStyled = styled.button`
  padding: 10px 15px;
  border: none;
  cursor: pointer;
  color: #fff;
  font-family: 'Teletactile';
  background-color: #4848a7;
  height: 48px;
  flex-direction: row;
  display: flex;
  align-items: center;
  border-radius: 4px;
  margin-right: 10px;
  font-size: 18px;
  display: flex;

  &:disabled {
    background: #797979;
    cursor: default;
  }
  span {
    padding-top: 1px;
    padding-left: 11px;
  }
`;

const REDIRECT_URI =
  'https://discord.com/api/oauth2/authorize?client_id=985200799460241428&redirect_uri=https%3A%2F%2Fraffle.metadrago.art&response_type=code&scope=identify';

export const DiscordButton = () => {
  const { isDiscordVerified } = useDiscord();

  const { publicKey, signMessage } = useWallet();
  const { setVisible } = useWalletModal();

  const handleVerifyWithDiscordClick = async () => {
    if (!publicKey) {
      setVisible(true);
      return;
    }

    if (isDiscordVerified) {
      return;
    }

    window.location.href = REDIRECT_URI;
  };

  return (
    <DiscordButtonStyled
      onClick={handleVerifyWithDiscordClick}
      disabled={isDiscordVerified}
    >
      <div style={{ display: 'flex', flexGrow: 1, width: 24 }}>
        <Image src='/discord.png' width={24} height={24} />
      </div>
      <span>{isDiscordVerified ? 'Verified' : 'Verify'}</span>
    </DiscordButtonStyled>
  );
};
