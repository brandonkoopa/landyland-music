import { useState } from 'react';
import styled from 'styled-components'

const ArtContainer = styled.div`
  border: 1px solid #000;
  background-color: #000;
`

const colors = {
  'W': '#FFF',
  '0': '#000',
  'R': '#CD0E2D',
  'G': '#20C25D',
  'B': '#203EC2',
  'Y': '#EEB949'
};

const defaultArt = [  '. . . . . . . . . . . . . . . .',  '. . . . . . . . . . . . . . . .',  '. . . . . . . . . . . . . . . .',  '. . . . . . . . . . . . . . . .',  '. . . . . . . . . . . . . . . .',  '. . . . . . . . . . . . . . . .',  '. . . . . . . . . . . . . . . .',  '. . . . . . . . . . . . . . . .',  '. . . . . . . . . . . . . . . .',  '. . . . . . . . . . . . . . . .',  '. . . . . . . . . . . . . . . .',  '. . . . . . . . . . . . . . . .',  '. . . . . . . . . . . . . . . .',  '. . . . . . . . . . . . . . . .',  '. . . . . . . . . . . . . . . .',  '. . . . . . . . . . . . . . . .'];

const ArtEditor = ({ art = defaultArt }) => {
  return (
    <ArtContainer>
      {Array.from(Array(32), (_, row) => (
        <div key={row} style={{ display: "flex" }}>
          {Array.from(Array(32), (_, col) => (
            <div
              key={col}
              style={{
                width: "1px",
                height: "1px",
                backgroundColor: colors[art[row]?.[col]],
                cursor: "pointer"
              }}
            ></div>
          ))}
        </div>
      ))}
    </ArtContainer>
  );  
}

export default ArtEditor;
