import styled, { keyframes } from 'styled-components';

const move = keyframes`
    0% {
        transform: rotate(0) scale(1);
        animation-timing-function: ease-in;
    }
    10% {
        transform: rotate(90deg) scale(0);
    }
    50% {
        transform: rotate(90deg) scale(0);
        animation-timing-function: ease-out;
    }
    60% {
        transform: rotate(180deg) scale(1);
    }
    100% {
        transform: rotate(180deg) scale(1);
    }
`;
const StyledSpinner = styled.div`
    --speed: 2s;
    --size: 0.5rem;

    margin: 2% auto 0;
    height: var(--size);
    width: var(--size);
    transform: translateX(-50%) translateY(-50%);
`;

const StyledBlock = styled.div`
    position: absolute;
    top: 0;
    left: 0;
    height: var(--size);
    width: var(--size);

    > .item {
        position: absolute;
        height: var(--size);
        width: var(--size);
        background: var(--white);
        animation: ${move} var(--speed) linear infinite;

        &:nth-of-type(1) {
            top: -0.5rem;
            left: -0.5rem;
            animation-delay: -1.75s;
        }

        &:nth-of-type(2) {
            top: -0.5rem;
            left: 0;
            animation-delay: -1.5s;
        }

        &:nth-of-type(3) {
            top: -0.5rem;
            left: var(--size);
            animation-delay: -1.25s;
        }

        &:nth-of-type(4) {
            top: 0;
            left: var(--size);
            animation-delay: -1s;
        }

        &:nth-of-type(5) {
            top: var(--size);
            left: var(--size);
            animation-delay: -0.75s;
        }

        &:nth-of-type(6) {
            top: var(--size);
            left: 0;
            animation-delay: -0.5s;
        }

        &:nth-of-type(7) {
            top: var(--size);
            left: -0.5rem;
            animation-delay: -0.25s;
        }

        &:nth-of-type(8) {
            top: 0;
            left: -0.5rem;
            animation-delay: 0s;
        }
    }
`;

const Spinner = () => {
    return (
        <StyledSpinner>
            <StyledBlock>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
                <div className="item"></div>
            </StyledBlock>
        </StyledSpinner>
    );
};

export default Spinner;
