import React from 'react'
import styled from 'styled-components';

const StyledWaveformButton = styled.button`
  background-color: #fff;
  border: 1px solid rgba(0,0,0,0);
  color: #333;
  border: 0;
  padding: 4px 16px;
  cursor: pointer;

  &:hover {
    border-color: ${props => props?.theme?.color?.hover || '#fff'};
  }

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