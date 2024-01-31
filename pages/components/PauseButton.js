import React from 'react'
import styled from 'styled-components';

const StyledPauseButton = styled.button`
  border: 1px solid;
  border-radius: 20px;
  width: 40px;
  height: 40px;
  background-color: #000;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 8px;

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    width: 4px;
    height: 14px;
    background-color: ${props => (props.theme && props.theme.color && props.theme.color.controlIconColor) || '#fff'};
    transform: translate(-50%, -50%);
  }

  &:after {
    left: 60%;
  }

  &:before {
    left: 40%;
  }
`;

const PauseButton = ({id, onClick, children}) => {
  return (
    <StyledPauseButton id={id} onClick={onClick}>{children}</StyledPauseButton>
  )
}

export default PauseButton;