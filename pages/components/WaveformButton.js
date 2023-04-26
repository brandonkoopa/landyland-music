import React from 'react'
import styled from 'styled-components';

const StyledWaveformButton = styled.button`
  background-color: #fff;
  color: #333;
  border: 0;
  padding: 4px 16px;

  &.selected {
    background-color: #92d3ff;
    color: #fff;
  }

  &.nes-btn {
    font-family: "Press Start 2P";
    font-size: 8px;
    padding: 4px 8px;
  }
  
  &:not(:last-of-type) {
    margin-right: 4px;
  }

  .triangle {
    top: -4px;
  }
`;

const WaveformButton = ({id, className, onClick, children}) => {
  return (
    <StyledWaveformButton id={id} className={className} onClick={onClick}>{children}</StyledWaveformButton>
  )
}

export default WaveformButton;