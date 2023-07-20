import React from 'react'
import styled from 'styled-components';

const StyledPauseButton = styled.button`
  border: 0;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background-color: transparent;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  /* margin: 0: */

  border: 1px solid;
  border-radius: 20px;
  padding: 8px;
  width: 40px;
  height: 40px;
  background-color: #000;

  &:before,
  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 40%;
    transform: translate(-50%, -50%);
    width: 4px;
    height: 14px;
    border-color: ${props => (props.theme && props.theme.color && props.theme.color.controlIconColor) || '#fff'};
  }

  &:after {
    left: 60%;
  }
`;

const PauseButton = ({id, onClick, children}) => {
  return (
    <StyledPauseButton id={id} onClick={onClick}>{children}</StyledPauseButton>
  )
}

export default PauseButton;