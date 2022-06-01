import { useWallet } from '@solana/wallet-adapter-react';
import { useWalletModal } from '@solana/wallet-adapter-react-ui';
import axios from 'axios';
import { isBefore, secondsToHours, secondsToMinutes } from 'date-fns';
import { RefObject, useEffect, useMemo, useRef, useState } from 'react';
import { Raffle } from '../market/Market';
import { PendingRaffleEntry } from './OpenRaffle';
import { buyRaffle } from './OpenRaffle.utils';

export const useCountdown = (
  endDate: number
): {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
  isTimeOver: boolean;
} => {
  const [now, setNow] = useState(Math.round(+new Date() / 1000));
  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Math.round(+new Date() / 1000));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  if (isBefore(endDate, now)) {
    return {
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      isTimeOver: true,
    };
  }

  const days = Math.floor(secondsToHours(endDate - now) / 24);
  const hours = secondsToHours(endDate - now) % 24;
  const minutes = secondsToMinutes(endDate - now) % 60;
  const seconds = (endDate - now) % 60;

  return {
    days,
    hours,
    minutes,
    seconds,
    isTimeOver: false,
  };
};

interface HashResponse {
  _id: string;
  hash: string;
  raffleId: string;
  confirmed: boolean;
  __v: number;
}

export const useRaffleLogic = (
  raffleId: string,
  raffleEntries: Raffle['entries'],
  rafflePrice: number
): {
  handleEnterRaffleClick: () => Promise<void>;
  isResultModalVisible: boolean;
  isLoading: boolean;
  setResultModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  resultModalErrorMessage: string | undefined;
  raffleEntryTicketsAmountInputRef: RefObject<HTMLInputElement>;
  ticketsYouHave: number;
  ticketsSold: number;
} => {
  const wallet = useWallet();
  const { setVisible } = useWalletModal();
  const [isLoading, setIsLoading] = useState(false);
  const [resultModalErrorMessage, setResultModalErrorMessage] = useState<
    string | undefined
  >();

  const raffleEntryTicketsAmountInputRef = useRef<HTMLInputElement>(null);

  const [isResultModalVisible, setResultModalVisible] = useState(false);


  const ticketsSold = useMemo(() => {
    return Object.keys(raffleEntries).reduce(
      (acc, hash) => acc + raffleEntries[hash],
      0
    );
  }, [raffleEntries]);

  const ticketsYouHave = useMemo(() => {
    if (!wallet.publicKey) {
      return 0;
    }
    return raffleEntries[wallet.publicKey.toBase58()] || 0;
  }, [raffleEntries, wallet]);


  const handleEnterRaffleClick = async () => {
    if (!wallet.publicKey) {
      setVisible(true);

      return;
    }

    setIsLoading(true);

    const raffleEntryTicketsAmount = Number(
      raffleEntryTicketsAmountInputRef.current?.value
    );

    try {
      const { signature } = await buyRaffle(
        wallet,
        raffleId,
        raffleEntryTicketsAmount,
        rafflePrice
      );

      setResultModalErrorMessage(undefined);
      setResultModalVisible(true);
    } catch (error: any) {
      setResultModalVisible(true);
      const errorMessage = error.message.includes('0x1')
        ? 'Insufficient funds'
        : error.message;
      setResultModalErrorMessage(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    handleEnterRaffleClick,
    isResultModalVisible,
    isLoading,
    setResultModalVisible,
    resultModalErrorMessage: resultModalErrorMessage,
    raffleEntryTicketsAmountInputRef,
    ticketsYouHave,
    ticketsSold,
  };
};
