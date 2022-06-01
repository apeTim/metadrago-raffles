import styled from 'styled-components';
import { useEffect, useState } from 'react';

// import { MintTable } from '../claim/Claim.styles';
import { OpenRaffle } from '../OpenRaffle/OpenRaffle';
import { ClosedRaffle } from '../ClosedRaffle/ClosedRaffle';
import { useQuery } from 'react-query';
import Spinner from '../Spinner/Spinner';
// import { StakeButton } from '../stake/Stake.styles.js';

const RaffleStore = styled.div`
  
  text-align: left;
  padding-bottom: 50px;
  gap: 40px;
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-start;
  
  @media screen and (max-width: 600px) {
    gap: 20px;
    justify-content: center;

  }
`;

export const Shimmer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 150%;
  z-index: -1;

  transform: translateX(-150%);
  animation: shimmer-move 3s ease infinite;
  background: linear-gradient(
    to right,
    rgba(0, 116, 212, 0) 0%,
    rgb(245, 127, 255) 50%,
    rgba(0, 116, 212, 0) 100%
  );
  transition: opacity 0.2s ease 0s;

  @keyframes shimmer-move {
    0% {
      transform: translateX(-150%);
    }
    to {
      transform: translateX(150%);
    }
  }
`;

export const RaffleImage = styled.img`
  object-fit: cover;
  width: 200px !important;
  height: 200px !important;
`;

export const ShowMoreButton = styled.button<{ minWidth?: number }>`
  display: block;
  font-weight: bold;
  color: #fff;
  background: var(--light-pink);
  // border: 2px solid var(--light-pink);
  font-family: 'Teletactile';

  border: none;
  font-size: 12px;
  min-height: 40px;
  min-width: ${(props) => props.minWidth || 130}px;
  margin: auto;
  cursor: pointer;
  transition: background 300ms ease, border-color 300ms ease, color 300ms ease;
  border-radius: 8px;
  transform: scale(1);
  position: relative;
  overflow: hidden;
  &:hover {
    // background: var(--pink);
    transform: scale(1.01);
  }
  &:active {
    transform: scale(0.99);
    // background: var(--dark-pink);
    border-color: var(--dark-pink);
  }
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    pointer-events: none;
  }
  &.purple {
    background: purple;
    border-color: var(--light-purple);
    color: var(--light-blue);
    &:hover {
      // background: var(--shadow-purple);
      border-color: var(--shadow-purple);
    }
  }
  &.blue {
    background: var(--light-blue);
    border-color: var(--light-blue);
    color: var(--dark-purple);
    &:hover {
      background: #0084af;
      border-color: #0084af;
      color: var(--white);
    }
  }
  &.green {
    background: #22e97d;
    border-color: #22e97d;
    color: var(--shadow-purple);
    &:hover {
      background: #008f15;
      border-color: #008f15;
      color: var(--white);
    }
  }
  &.inverted {
    background: transparent;
    color: var(--light-pink);
    &:hover {
      color: var(--dark-pink);
    }
  }

  @keyframes shimmer-move {
    0% {
      transform: translateX(-150%);
    }
    to {
      transform: translateX(150%);
    }
  }
`;

export const RaffleTitle = styled.h2`
    // position: absolute;
    bottom: 0;
    left: 0;
    color: #fff;
    text-shadow:0 0 6px #484848;
    width: 100%;
    margin-top: 9px;
    margin-bottom: 9px;
    font-size: 18px;
}
`;

export const RaffleContainer = styled.div`
  flex: 1;
`;

export const InfoLink = styled.a`
  width: 24px;
  height: 24px;
  display: inline-block;
  vertical-align: sub;
`;

export const InfoIcon = styled.img`
  border: none !important;
  display: block;
  width: 100% !important;
  height: 100% !important;
`;

export interface Raffle {
  _id: string;
  winners: string[];
  title: string;
  price: number;
  end: number;
  max_winners: number;
  imageURL: string;
  discordURL: string;
  type: string;
  entries: Record<string, number>;
  active: boolean;
  __v: number;
}

const TEN_SECONDS = 10 * 1000;

const amountSold = (entries: Raffle['entries']) => {
  return Object.keys(entries).reduce((acc, hash) => acc + entries[hash], 0);
};
const numberWithCommas = (x: number) => {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const fetchRaffles = async () => {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/raffle`, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
    },
  });
  const json = await response.json();
  return json;
};

const MarketTitle = styled.h3`
  font-size: 24px;
  margin-bottom: 40px;

  &:first-letter {
    color: #875dff;
  }
`;

const Market: React.FC = () => {
  const [totalBurned, setTotalBurned] = useState('loading');
  const [activeRaffles, setActiveRaffles] = useState<Raffle[]>([]);
  const [completedRaffles, setCompletedRaffles] = useState<Raffle[]>([]);
  const [amountCompletedRafflesToDisplay, setAmountCompletedRafflesToDisplay] =
    useState(6);

  const query = useQuery('raffles', fetchRaffles, {
    refetchInterval: TEN_SECONDS,
  });

  useEffect(() => {
    if (!query.data) {
      return;
    }
    let total = 0;
    [...query.data.active, ...query.data.complete].forEach((listing) => {
      total += amountSold(listing.entries) * listing.price;
    });
    setTotalBurned(numberWithCommas(total));

    setActiveRaffles(query.data.active);
    setCompletedRaffles(query.data.complete);
  }, [query.data]);

  return (
    <>
      <div style={{ padding: '0 20px', maxWidth: 1400 }}>
        <MarketTitle>METADRAGO DAO Lottery</MarketTitle>
        {/* <div
          style={{
            color: 'white',
            margin: '40px 0 40px 15px',
          }}
        >
          Burned {totalBurned} $NEON
        </div> */}
        {/* <h3 style={{ fontSize: '18px', marginBottom: 20 }}>Active Raffles</h3> */}
        {query.data ? (
          <RaffleStore>
            {/* {completedRaffles
              .slice(0, 2).map((raffle) => ({...raffle, end: 1653701, active: true}))
              .sort((a, b) => a.end - b.end)
              .map((raffle) => {
                return <OpenRaffle key={raffle._id} {...raffle} />;
              })} */}
            {activeRaffles
              .sort((a, b) => a.end - b.end)
              .map((raffle) => {
                return <OpenRaffle key={raffle._id} {...raffle} />;
              })}
            {completedRaffles
              .sort((a, b) => b.end - a.end)
              .slice(0, amountCompletedRafflesToDisplay)
              .map((raffle) => (
                <ClosedRaffle key={raffle._id} {...raffle} />
              ))}
            {/* {amountCompletedRafflesToDisplay < completedRaffles.length && (
              <ShowMoreButton
                style={{ marginBottom: 20 }}
                className='purple'
                onClick={() => {
                  setAmountCompletedRafflesToDisplay(
                    amountCompletedRafflesToDisplay + 12
                  );
                }}
              >
                SHOW MORE
              </ShowMoreButton>
            )} */}
          </RaffleStore>
        ) : (
          <Spinner />
        )}
        {amountCompletedRafflesToDisplay < completedRaffles.length && (
          <ShowMoreButton
            style={{ marginBottom: 20 }}
            className='purple'
            onClick={() => {
              setAmountCompletedRafflesToDisplay(
                amountCompletedRafflesToDisplay + 12
              );
            }}
          >
            SHOW MORE
          </ShowMoreButton>
        )}
        {/* <h3 style={{ fontSize: '18px', marginBottom: 20 }}>Completed Raffles</h3> */}
        {/* {query.data ? (
          <>
            <RaffleStore>
              {completedRaffles
                .sort((a, b) => b.end - a.end)
                .slice(0, amountCompletedRafflesToDisplay)
                .map((raffle) => (
                  <ClosedRaffle key={raffle._id} {...raffle} />
                ))}
            </RaffleStore>
            {amountCompletedRafflesToDisplay < completedRaffles.length && (
              <ShowMoreButton
                style={{ marginBottom: 20 }}
                className='purple'
                onClick={() => {
                  setAmountCompletedRafflesToDisplay(
                    amountCompletedRafflesToDisplay + 12
                  );
                }}
              >
                SHOW MORE
              </ShowMoreButton>
            )}
          </>
        ) : (
          <Spinner />
        )} */}
      </div>
    </>
  );
};

export default Market;
