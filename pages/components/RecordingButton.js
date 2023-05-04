import React from 'react'
import styled from 'styled-components'
import { Button } from 'antd'

const StyledRecordingButton = styled(Button)`
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: #ff0000;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
  position: relative;
  overflow: hidden;

  &:before {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: #fff;
  }

  &:after {
    content: "";
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) scale(0.8);
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background-color: #ff0000;
    animation: pulse 2s infinite;
  }

  @keyframes pulse {
    0% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 1;
    }
    50% {
      transform: translate(-50%, -50%) scale(1.2);
      opacity: 0.5;
    }
    100% {
      transform: translate(-50%, -50%) scale(0.8);
      opacity: 1;
    }
  }
`;

const RecordingButton = ({id, onClick, children}) => {
  return (
    <StyledRecordingButton id={id} onClick={onClick}>{children}</StyledRecordingButton>
  )
}

export default RecordingButton;