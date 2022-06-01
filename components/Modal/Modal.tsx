import { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import React from 'react';
import styled from 'styled-components';

interface ModalProps {
  children: React.ReactElement;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.25);
`;

const ModalContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 40px;
`;
let modalContainer: undefined | Element;
if (typeof window !== 'undefined') {
  // client-side-only code
  modalContainer = document.createElement('div');
  document.body.appendChild(modalContainer);
}

export const Modal: React.ComponentType<ModalProps> = (props) => {
  //   const [isOpen, setIsOpen] = useState(false);
  useEffect(() => {
    document.body.classList.add('scroll-lock');
    return () => {
      document.body.classList.remove('scroll-lock');
    };
  }, []);
  if (typeof window === 'undefined') {
    return null;
  }

  return ReactDOM.createPortal(
    <Overlay
      onClick={() => {
        props.onClose();
      }}
    >
      <ModalContainer>
        <div onClick={(event) => event.stopPropagation()}>{props.children}</div>
      </ModalContainer>
    </Overlay>,
    modalContainer!
  );
};
