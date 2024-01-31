import React, { useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  position: absolute;
  z-index: 100;
  transform: translate(22px, -142px);
`;

const Button = styled.button`
  position: fixed;
  font-size: 13px;
  top: 0;
  left: 50%;
  width: 50px;
  height: 50px;
  border: none;
  border-radius: 50%;
  transform: translate(-50%, -50%) rotate(${({ angle }) => angle}deg);
  background-color: ${({ active }) => active ? '#2196f3' : '#fff'};
  color: ${({ active }) => active ? '#fff' : '#000'};
  font-size: 16px;
  cursor: pointer;
  border: 2px solid #000;
  &:hover {
    background-color: ${({ active }) => active ? '#2196f3' : '#ccc'};
  }
`;

const majorKeys = ['C', 'C#/Db', 'D', 'D#/Eb', 'E', 'F', 'F#/Gb', 'G', 'G#/Ab', 'A', 'A#/Bb', 'B'];
const minorKeys = ['a', 'e', 'b', 'f#', 'c#', 'g#/ab', 'd#/eb', 'bb/a#', 'f', 'c', 'g', 'd'];

const KeyMenu = ({handleOptionClick}) => {
  const [activeOption, setActiveOption] = useState(majorKeys[0]);

  const circleRadius = 100;
  const angleStep = 360 / Math.max(majorKeys.length, minorKeys.length);

  return (
    <Container>
      <div id="keys-outer-circle">
        {majorKeys.map((option, index) => {
          const angle = ((index + 3) % 12) * (Math.PI / 6);
          const outerRadius = 150;
          const outerX = Math.sin(angle) * outerRadius;
          const outerY = -Math.cos(angle) * outerRadius;
  
          return (
            <Button
              key={option}
              active={option === activeOption}
              onClick={() => handleOptionClick(option)}
              style={{ transform: `translate(${outerX}px, ${outerY}px)` }}
            >
              {option}
            </Button>
          );
        })}
      </div>
      <div id="keys-inner-circle">
        {minorKeys.map((option, index) => {
          const angle = ((index + 3) % 12) * (Math.PI / 6);
          const innerRadius = 98;
          const innerX = Math.sin(angle) * innerRadius;
          const innerY = -Math.cos(angle) * innerRadius;
  
          return (
            <Button
              key={option}
              active={option === activeOption}
              onClick={() => handleOptionClick(option)}
              style={{ transform: `translate(${innerX}px, ${innerY}px)` }}
            >
              {option}
            </Button>
          );
        })}
      </div>
    </Container>
  )
};

export default KeyMenu;
