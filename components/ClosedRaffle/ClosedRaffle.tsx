import {
  InfoIcon,
  InfoLink,
  Raffle,
  RaffleContainer,
  RaffleImage,
  RaffleTitle,
} from '../market/Market';
import ticket from '../ticket.gif';
// import info from '../info.svg';
import confetti from 'canvas-confetti';
// import { Styled } from '../../Feedback.jsx';
// import { StakeOverlay } from '../../stake/Stake.styles';
import React, { useMemo, useState } from 'react';
import styled from 'styled-components';
import {
  MarketStakeButton,
  RaffleItem,
  ClosedRibbon,
  ClosedRibbonNFT,
} from '../market/Market.styles';
import { useWallet } from '@solana/wallet-adapter-react';
import { Modal } from '../Modal/Modal';

/**
 * VISUAL:
 * background-image
 * fonts, colors,
 *
 * LOGIC:
 * connect wallet button, connect necessary libs
 * describe data types, fetch data, display data
 */
const WinnersList = styled.div`
  max-width: 700px;
  min-width: 550px;
  min-height: 300px;
  padding: 50px;
  height: 100%;
  overflow-y: auto;
  box-sizing: border-box;
  background: #1c001c;

  &::-webkit-scrollbar {
    // display: none;
  }
`;

const ClosedRaffleItem = styled(RaffleItem)`
  // box-shadow: 0 0 5px;
  // border: 1px solid #857ca9;
  background: radial-gradient(
    circle,
    rgba(2, 0, 36, 1) 0%,
    rgb(5, 22, 41) 51%,
    #264146 100%
  );
  background: radial-gradient(
    circle,
    rgba(83, 26, 87, 0.7) 38%,
    rgba(18, 91, 96, 0.7) 100%
  );
  background: rgba(44, 14, 46, 0.6);
  background: #181422;
  filter: grayscale(100%);
  transition: filter 0.2s ease 0s;

  &:hover {
    // filter: grayscale(80%);
  }
`;

const ClosedRaffleMarketStakeButton = styled(MarketStakeButton)`
  background-color: #572d61;
  transform: scale(1);
  color: #fefefe;
  font-family: 'Teletactile';

  &:hover {
    // background-color: #555;
    transform: scale(1);
  }
`;

interface ClosedRaffleProps extends Raffle {}

const WinnerRow = styled.tr`
  box-shadow: inset 0 0 30px #4feb4f, 0 0 5px #4feb4f;
  cursor: cell;
  transition: box-shadow 0.1s;
  border-radius: 3px;

  &:hover {
    box-shadow: inset 0 0 35px #00ff0a, 0 0 8px #00ff0a;
  }
`;
const COLORS = ['#7d49d5', '#8965c4', '#5e19d0', '#3c147e', '#a17dd7'];
const WINNER_COLORS = ['#6eea73', '#51df56', '#08ca0f', '#0e8812'];
export const RaffleImageContainer = styled.div`
  position: relative;
  margin-bottom: 10px;
`;

const YouWonText = styled.p`
  color: #26db26;
  text-shadow: 0 0 5px #42af42;
  margin-top: 0;
`;

const YouWonTableText = styled(YouWonText)`
  margin: 0;
`;

const TD = styled.td`
  border-bottom: none !important;
`;

const TH = styled.th`
  padding: 1rem;
  font-size: 16px;
`;

const TR = styled.tr`
  border-bottom: 2px solid #8661d4;
`;

export const ClosedRaffle: React.FC<ClosedRaffleProps> = (props) => {
  const [showModal, setShowModal] = useState(false);
  const { publicKey } = useWallet();

  const amountSold = useMemo(() => {
    return Object.keys(props.entries).reduce(
      (acc, hash) => acc + props.entries[hash],
      0
    );
  }, [props.entries]);

  /* data
    {address:amount}

    // table
    // modals fix scroll + margins
    */

  const HIDDEN_WALLET_LENGTH_AMOUNT = 5;
  const hideWallet = (wallet: string): string => {
    return (
      wallet.substring(0, HIDDEN_WALLET_LENGTH_AMOUNT) +
      '…' +
      wallet.substring(wallet.length - HIDDEN_WALLET_LENGTH_AMOUNT)
    );
  };
  const winners = useMemo(() => {
    return props.winners.reduce<{ [wallet: string]: number }>(
      (acc, wallet: string) => {
        return {
          ...acc,
          [wallet]: acc[wallet] + 1 || 1,
        };
      },
      {}
    );
  }, [props.winners]);

  const wonAmount = (publicKey && winners[publicKey?.toBase58()]) || 0;
  return (
    <>
      {showModal && (
        <Modal
          // isVisible={showModal}
          onClose={() => {
            setShowModal(false);
          }}
        >
          <WinnersList onClick={(event) => event.stopPropagation()}>
            <h2>«{props.title}» Winners</h2>

            {Boolean(wonAmount) && (
              <>
                <YouWonTableText>you won {wonAmount}</YouWonTableText>
                <a
                  href={process.env.NEXT_PUBLIC_DISCORD_URL}
                  target={'_blank'}
                  rel='noreferrer'
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    margin: '30px 0',
                    color: '#6daffa',
                  }}
                >
                  <span>{'>> please open a ticket in our discord <<'}</span>
                </a>
              </>
            )}
            <table style={{ borderCollapse: 'collapse' }}>
              <tbody>
                <TR>
                  <TH>Address</TH>
                  <TH>Amount Won</TH>
                </TR>
                {Object.entries(winners).map(([wallet, amount]) => {
                  return (
                    <React.Fragment key={wallet}>
                      {wallet === publicKey?.toBase58() ? (
                        <WinnerRow title='you won! create a discord ticket'>
                          <TD>{hideWallet(wallet)}</TD>
                          <TD>{amount}</TD>
                        </WinnerRow>
                      ) : (
                        <TR>
                          <TD>{hideWallet(wallet)}</TD>
                          <TD>{amount}</TD>
                        </TR>
                      )}
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </WinnersList>
        </Modal>
      )}
      <ClosedRaffleItem>
        {/* {props.type === 'nft' && (
          <ClosedRibbonNFT>{props.type}</ClosedRibbonNFT>
        )}
        {props.type === 'whitelist' && (
          <ClosedRibbon>{props.type}</ClosedRibbon>
        )} */}
        <div style={{ marginBottom: 10, color: '#52b7ff' }}>{props.type}</div>
        <RaffleImageContainer>
          <RaffleImage
            loading='lazy'
            src={props.imageURL}
            style={{
              border: 'none',
              borderRadius: '5px',
              boxShadow: '-1px 2px 15px var(--dark-pink)',
            }}
          />
          <RaffleTitle>{props.title} </RaffleTitle>
        </RaffleImageContainer>

        <RaffleContainer>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <h3>
              {props.winners.length} Winner
              {props.winners.length === 1 ? '' : 's'}
            </h3>{' '}
            {/* <InfoLink href={props.discordURL} target='_blank'> */}
            {/* <InfoIcon src={info} /> */}
            {/* </InfoLink> */}
          </div>
          <div
            style={{
              flexDirection: 'row',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 15,
              paddingRight: 15,
              margin: '10px 0',
            }}
          >
            <span className='credit' style={{ fontSize: 15, marginRight: 10 }}>
              Sold:
            </span>
            <h3>{amountSold}</h3>
          </div>

          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              paddingLeft: 15,
              paddingRight: 15,
              margin: '5px 0',
            }}
          >
            <span className='credit' style={{ fontSize: 15, marginRight: 10 }}>
              Price:
            </span>
            <h3>$EMBER {props.price}</h3>
          </div>
          <h4 style={{ marginTop: 20 }}>completed</h4>
        </RaffleContainer>

        {Boolean(wonAmount) && <YouWonText>you won {wonAmount}</YouWonText>}
        <div style={{ display: 'flex', flexDirection: 'row' }}>
          <ClosedRaffleMarketStakeButton
            onClick={() => {
              setShowModal(true);
              const end = Date.now() + 3 * 1000;
              // (function frame() {
              //   confetti({
              //     particleCount: 6,
              //     angle: 60,
              //     spread: 55,
              //     origin: { x: 0 },
              //     colors: wonAmount ? WINNER_COLORS : COLORS,
              //   });
              //   confetti({
              //     particleCount: 6,
              //     angle: 120,
              //     spread: 55,
              //     origin: { x: 1 },
              //     colors: wonAmount ? WINNER_COLORS : COLORS,
              //   });

              //   if (Date.now() < end) {
              //     requestAnimationFrame(frame);
              //   }
              // })();
            }}
            style={{ marginTop: 0, width: '100%' }}
          >
            View Winners
          </ClosedRaffleMarketStakeButton>
        </div>
      </ClosedRaffleItem>
    </>
  );
};
