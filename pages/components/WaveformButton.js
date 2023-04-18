import React from 'react'
import styled from 'styled-components';

const StyledWaveformButton = styled.button`
  padding: 8px;
  margin-bottom: 8px;
  background-color: #333;
  color: #fff;
  border: 0;
  
  &:not(:last-of-type) {
    margin-right: 8px;
  }
`;

const WaveformButton = ({id, className, onClick, children}) => {
  return (
    <StyledWaveformButton id={id} className={className} onClick={onClick}>{children}</StyledWaveformButton>
  )
}

export default WaveformButton;