import React from 'react'
import styled from 'styled-components'

const StyledPlayButton = styled.button`
  border: 0;
  width: 30px;
  height: 30px;
  background-color: transparent;
  position: relative;
  overflow: hidden;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;

  border: 1px solid;
  border-radius: 20px;
  padding: 8px;
  width: 40px;
  height: 40px;
  background-color: #000;

  &:hover {
    border-color: ${props => (props.theme && props.theme.color && props.theme.color.selected) || '#fff'};
  }

  &::before {
    content: "";
    position: absolute;
    top: 50%;
    left: 58%;
    transform: translate(-50%, -50%);
    width: 0;
    height: 0;
    border-top: 10px solid transparent;
    border-bottom: 10px solid transparent;
    border-left: 20px solid ${props => props?.theme?.color?.controlIconColor || '#fff'};
  }
`;

const PlayButton = ({ id, onClick, children }) => {
  return (
    <StyledPlayButton id={id} onClick={onClick}>
      {children}
    </StyledPlayButton>
  );
};

export default PlayButton;
