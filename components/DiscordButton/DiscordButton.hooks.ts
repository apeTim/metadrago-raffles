import axios from 'axios';
import { useEffect, useState } from 'react';
import DiscordOauth2 from 'discord-oauth2';
import { useWallet } from '@solana/wallet-adapter-react';
import { encode } from 'bs58';
import { PublicKey } from '@solana/web3.js';

const CLIENT_ID = '985200799460241428';
const CLIENT_SECRET = 'qXMAZrMXunT7OyDLv-uY5gtY_Z7JtXcD';
const REDIRECT_URI = 'https://raffle.metadrago.art';

export const useDiscord = (): {
  isDiscordVerified: boolean;
} => {
  const { publicKey, signMessage } = useWallet();
  const [isAccessTokenLoaded, setIsAccessTokenLoaded] = useState(false);
  const [isDiscordVerified, setIsDiscordVerified] = useState(false);

  const discord = async () => {
    const { code } = new Proxy(new URLSearchParams(window.location.search), {
      get: (searchParams, prop) => searchParams.get(String(prop)),
    });

    if (!code || isDiscordVerified) {
      const getVerificationState = async (publicKey: PublicKey) => {
        if (!publicKey) {
          return;
        }

        const wallet = publicKey.toBase58();
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_URL}/user/${wallet}`
        );

        return response.data.verified;
      };
      const isVerified = await getVerificationState(publicKey!);
      if (isVerified) {
        setIsDiscordVerified(true);
      }
      return;
    }

    try {
      const oauth = new DiscordOauth2();
      const tokenResponse = await oauth.tokenRequest({
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,

        code: code,
        scope: 'identify',
        grantType: 'authorization_code',

        redirectUri: REDIRECT_URI,
      });
      setIsAccessTokenLoaded(true);

      const accessToken = tokenResponse.access_token;
      const wallet = publicKey?.toBase58();
      if (!signMessage) {
        return;
      }
      const signature = encode(
        await signMessage(new TextEncoder().encode(accessToken))
      );

      await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/verify`, {
        accessToken,
        wallet,
        signedMessage: signature,
        withCredentials: false,
      });

      setIsDiscordVerified(true);
    } catch {
      //pass
    }

    // clear query params
    window.history.replaceState({}, '', '/');
  };

  useEffect(() => {
    if (!signMessage || !publicKey || isAccessTokenLoaded) {
      return;
    }

    discord();
  }, [Boolean(signMessage), Boolean(publicKey), isAccessTokenLoaded]);

  return { isDiscordVerified };
};
