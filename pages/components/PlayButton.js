import React from 'react'
import styled from 'styled-components';

const StyledPlayButton = styled.button`
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
    position: relative;
    overflow: hidden;

    &:before {
      content: "";
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      width: 0;
      height: 0;
      border-top: 20px solid transparent;
      border-bottom: 20px solid transparent;
      border-left: 30px solid #000;
    }
`;

const PlayButton = ({id, onClick, children}) => {
  return (
    <StyledPlayButton id={id} onClick={onClick}>{children}</StyledPlayButton>
  )
}

export default PlayButton;