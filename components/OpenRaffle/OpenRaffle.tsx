import {
  InfoIcon,
  InfoLink,
  Raffle,
  RaffleContainer,
  RaffleImage,
  RaffleTitle,
  Shimmer,
} from '../market/Market';
// import ticket from '../ticket.gif';
// import info from '../info.svg';
// import { StakeOverlay } from '../../stake/Stake.styles';
import { useCountdown, useRaffleLogic } from './OpenRaffle.hooks';
import {
  MarketStakeButton,
  RaffleItem,
  Ribbon,
  RibbonNFT,
} from '../market/Market.styles';
import styled from 'styled-components';
// import { Styled } from '../../Feedback.jsx';
// import { NeonButton } from '../../animations';
import { RaffleImageContainer } from '../ClosedRaffle/ClosedRaffle';
import Spinner from '../Spinner/Spinner';
import { Modal } from '../Modal/Modal';
import { useWallet } from '@solana/wallet-adapter-react';
import { useQuery } from 'react-query';
import axios from 'axios';

const ResultModal = styled.div`
  max-width: 700px;
  min-width: 300px;
  min-height: 300px;
  padding: 50px;
  background: #824cfb;
`;

const Ticket = styled.img`
  width: 210px !important;
  height: 150px !important;
  border: none !important;
`;

const FailedTicket = styled(Ticket)`
  filter: grayscale(70%) blur(4px) contrast(50%);
`;

interface OpenRaffleProps extends Raffle {}
export type PendingRaffleEntry = [number, string];

export const fetchPending = async (wallet: string) => {
  return await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/pending/${wallet}`);
  
};
export const OpenRaffle = (props: OpenRaffleProps) => {
  const { days, hours, minutes, seconds, isTimeOver } = useCountdown(props.end);

  const {
    handleEnterRaffleClick,
    isLoading,
    isResultModalVisible,
    setResultModalVisible,
    raffleEntryTicketsAmountInputRef,
    resultModalErrorMessage,
    ticketsSold,
    ticketsYouHave,
  } = useRaffleLogic(props._id, props.entries, props.price);

  const raffleEntryTicketsAmount = Number(
    raffleEntryTicketsAmountInputRef.current?.value
  );


  const wallet = useWallet();

  const queryPending = useQuery(
    ['pending', wallet.publicKey?.toBase58()!],
    () => fetchPending(wallet.publicKey?.toBase58()!),
    {
      refetchInterval: 1000,
    }
  );

  const pendingTicketsAmount = queryPending.data?.data.pending.length;

  return (
    <>
      {isResultModalVisible && (
        <Modal onClose={() => setResultModalVisible(false)}>
          <ResultModal>
            {resultModalErrorMessage ? (
              <>
                <h2>Purchase Failed</h2>
                <p>{resultModalErrorMessage}</p>
                <p>
                  Unable to buy {raffleEntryTicketsAmount} ticket
                  {raffleEntryTicketsAmount > 1 && 's'} for {props.title} Raffle
                </p>
                {/* <FailedTicket src={ticket} /> */}
                <div
                  // className={isLoading && 'disabled'}
                  onClick={handleEnterRaffleClick}
                  // text={}
                >
                  {isLoading ? 'LOADING…' : 'RETRY'}
                </div>
              </>
            ) : (
              <>
                <h2>Purchase Processing…</h2>
                <p style={{ lineHeight: 1.7 }}>
                  You're all set! Your purchase of {raffleEntryTicketsAmount}{' '}
                  ticket
                  {raffleEntryTicketsAmount > 1 && 's'} for {props.title} Raffle
                  will be successfully processed within a few minutes on the
                  blockchain.
                </p>
                {/* <Ticket src={ticket} /> */}
              </>
            )}
          </ResultModal>
        </Modal>
      )}

      <RaffleItem>
        <div style={{ marginBottom: 10, color: '#52b7ff' }}>{props.type}</div>
        <RaffleImageContainer>
          <RaffleImage
            src={props.imageURL}
            style={{
              boxShadow: '-1px 2px 25px var(--dark-pink)',
              borderRadius: '8px',
              border: 'none',
            }}
          />
          <RaffleTitle>{props.title} </RaffleTitle>
        </RaffleImageContainer>
        {/* {props.type === 'nft' && <RibbonNFT>{props.type}</RibbonNFT>}
        {props.type === 'whitelist' && <Ribbon>{props.type}</Ribbon>} */}
        <RaffleContainer>
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 15,
              paddingRight: 15,
            }}
          >
            <h3>
              {props.max_winners === 1
                ? '1 Winner'
                : `${props.max_winners} Winners`}
            </h3>
            {/* <InfoLink href={props.discordURL} target='_blank' rel='noreferrer'> */}
            {/* <InfoIcon src={info} /> */}
            {/* </InfoLink> */}
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 15,
              paddingRight: 15,
              margin: '10px 0',
              color: '#c2a8fa',
            }}
          >
            <span className='credit' style={{ fontSize: 13, marginRight: 10 }}>
              Sold:
            </span>
            <h3>{ticketsSold}</h3>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 15,
              paddingRight: 15,
              margin: '10px 0',
              color: '#c2a8fa',
            }}
          >
            <span className='credit' style={{ fontSize: 13, marginRight: 10 }}>
              Price:
            </span>
            <h3>$EMBER {props.price}</h3>
          </div>
          {isTimeOver ? (
            <h4>completed</h4>
          ) : (
            <h4>
              {days}:{hours}:{minutes}:{seconds}
            </h4>
          )}
        </RaffleContainer>

        <div
          style={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <input
            type='number'
            style={{
              backgroundColor: '#2f2c52',
              color: 'white',
              width: 80,
              margin: 0,
              fontSize: 20,
              paddingLeft: 10,
              background: '#111',
              height: '100%',
              borderRadius: '5px',
              border: '1px solid #4b4b4b',
            }}
            defaultValue='1'
            ref={raffleEntryTicketsAmountInputRef}
          />

          <MarketStakeButton
            style={{
              marginTop: 0,
              width: '100%',
              marginLeft: '10px',
              backgroundColor: '#824cfb',
              color: '#fff',
            }}
            disabled={isTimeOver || isLoading}
          >
            <div
              style={{
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontFamily: 'Teletactile',
              }}
              onClick={handleEnterRaffleClick}
            >
              {/* <Shimmer /> */}
              {isLoading ? 'LOADING…' : 'ENTER RAFFLE'}
            </div>
          </MarketStakeButton>
        </div>

        <div
          style={{
            marginTop: 17,
            fontSize: 11,
            minHeight: 22,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {Boolean(pendingTicketsAmount) ? (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                color: '#fff',
                paddingLeft: '15px',
                lineHeight: 1.1,
              }}
            >
              <Spinner />
              <span>processing {pendingTicketsAmount} tickets</span>
            </div>
          ) : (
            <>you have {ticketsYouHave} tickets</>
          )}
        </div>
      </RaffleItem>
    </>
  );
};
