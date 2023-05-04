import React from 'react'
import styled from 'styled-components'
import { Button } from 'antd'

const StyledSaveButton = styled(Button)`
  background-color: #00B4EE;
  color: #fff !important;
  opacity: 1;
  font-size: 23px;
  padding: 0;
  background-color: transparent;
  border: 0;
  box-shadow: none !important;
  transform: translateY(-6px);

  :disabled {
    opacity: 0.25;
  }
`;

const SaveButton = ({id, onClick, children}) => {
  return (
    <StyledSaveButton id={id} onClick={onClick}>{children}</StyledSaveButton>
  )
}

export default SaveButton;