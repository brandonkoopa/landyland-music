import React, { useState } from "react";
import styled from "styled-components";

const DropdownContainer = styled.div`
  position: relative;
`;

const DropdownButton = styled.button`
  display: flex;
  align-items: center;
  padding: 8px;
  border: none;
  background-color: #f2f2f2;
  cursor: pointer;

  img {
    width: 20px;
    margin-right: 8px;
  }
`;

const DropdownList = styled.ul`
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
  border: 1px solid #ccc;
  border-top: none;
  background-color: #fff;
`;

const DropdownItem = styled.li`
  padding: 8px;
  cursor: pointer;

  &:hover {
    background-color: #f2f2f2;
    border-color: ${props => props?.theme?.color?.hover || '#fff'};
  }
`;

const KeyboardImage = styled.img.attrs({
  src: "/path/to/keyboard-image.png",
})``;

const GamepadImage = styled.img.attrs({
  src: "/path/to/gamepad-image.png",
})``;

function InputTypeDropdown({isOpen, setIsOpen, currentInputType, handleInputTypeItemClick }) {
  return (
    <DropdownContainer>
      <DropdownButton onClick={() => setIsOpen(!isOpen)}>
        {currentInputType === "keyboard" ? (
          <KeyboardImage />
        ) : (
          <GamepadImage />
        )}
        {currentInputType || "Select Input Type"}
      </DropdownButton>
      {isOpen && (
        <DropdownList>
          <DropdownItem onClick={() => handleInputTypeItemClick("keyboard")}>
            <KeyboardImage />
            Keyboard
          </DropdownItem>
          <DropdownItem onClick={() => handleInputTypeItemClick("gamepad")}>
            <GamepadImage />
            Gamepad
          </DropdownItem>
        </DropdownList>
      )}
    </DropdownContainer>
  );
}

export default InputTypeDropdown;
