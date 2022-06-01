import styled from 'styled-components';
// import { StakeButton } from '../stake/Stake.styles';

export const Ribbon = styled.div`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translate(-71%, 92%) rotate(-33deg);
  color: #fff;
  text-transform: uppercase;
  background: #bb1eab;
  font-size: 0.8rem;
  padding: 10px 70px;
  border-radius: 5px;
  z-index: 1;
`;

export const ClosedRibbon = styled(Ribbon)`
  filter: grayscale(30%);
`;

export const RibbonNFT = styled(Ribbon)`
  transform: translate(-94%, 36%) rotate(-33deg);
  background: linear-gradient(#2f4ae6, #0d8bdc);
`;

export const ClosedRibbonNFT = styled(RibbonNFT)`
  filter: grayscale(30%);
`;

export const RaffleItem = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  // width: 200px;
  padding: 15px 20px;
  // margin: 20px;
  // background: #763fb5;
  background: linear-gradient(
    180deg,
    rgba(83, 26, 87, 0.7) 26%,
    rgba(32, 63, 138, 0.7) 56%,
    rgba(18, 91, 96, 0.7) 100%
  );
  background: rgba(44, 14, 46, 1);
  background: #181422;
  // box-shadow: 0 0 18px;
  border-radius: 10px;
  border: 2px solid #1f1b29;
  width: 280px;
  
  h2 {
    // height: 40px;
    // line-height: 15px;
    // font-size: 15px;
    // letter-spacing: 2px;
    // margin-left: 0px;
    // margin-right: 0px;
    // color: white;
    // line-height: 30px;
  }
  h3 {
    margin-left: 0px;
    margin-right: 0px;
    margin: 0;
    font-size: 11px;
    color: white;
    margin-right: 8px;
    color: #c2a8fa;
  }
  h4 {
    margin-top: 10px;
    margin-bottom: 10px;
    font-size: 11px;
    text-align: center;
    color: #c2a8fa;
  }
  text-align: center;
  // border: 1px solid #763fb5;
`;

export const MarketStakeButton = styled.button`
  // box-shadow: 0px 3px 0px rgba(154, 0, 152), 0px 5px 25px rgb(238, 83, 236);
  text-transform: uppercase;
  border: none;
  transition: background 150ms ease, border-color 300ms ease, color 300ms ease,
    transform 150ms ease, box-shadow 150ms ease;
  border-radius: 8px;
  transform: scale(1);
  position: relative;
  overflow: hidden;
  height: 40px;
  cursor: pointer;
  font-weight: bold;
  line-height: 1;

  &:hover {
    // background: var(--pink);
    transform: scale(1.01);
  }

  &:active {
    transform: scale(0.99);
    // background: var(--dark-pink);
    // box-shadow: 0px 0px 0px rgba(154, 0, 152), 0px 0px 5px rgb(238, 83, 236);
  }
`;
