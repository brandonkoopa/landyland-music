import React from 'react'
import styled from 'styled-components';

const StyledWaveformButton = styled.button`
  margin-bottom: 8px;
  background-color: #fff;
  color: #333;
  border: 0;
  padding: 4px 7px;

  &.selected {
    background-color: #333;
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
`;

const WaveformButton = ({id, className, onClick, children}) => {
  return (
    <StyledWaveformButton id={id} className={className} onClick={onClick}>{children}</StyledWaveformButton>
  )
}

export default WaveformButton;