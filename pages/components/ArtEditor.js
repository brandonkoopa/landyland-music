import { useState } from 'react';
import styled from 'styled-components'

const ColorButton = styled.button`
  border: 0;
  height: 16px;
  width: 16px;
`

const colors = {
  'W': '#FFF',
  '0': '#000',
  'R': '#CD0E2D',
  'G': '#20C25D',
  'B': '#203EC2',
  'Y': '#EEB949'
};

const defaultArt = [
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . . .',
];

const ArtEditor = ({ art = defaultArt, setArt }) => {
  const [selectedColor, setSelectedColor] = useState('W');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);


  const handlePixelClick = (row, col) => {
    let newArt = [...art];
    if (newArt.length === 0) {
      // fill the array with the correct number of items
      for (let i = 0; i < 32; i++) {
        newArt.push('. '.repeat(31).trim());
      }
    }
    if (isErasing) {
      if (newArt[row]) {
        newArt[row] = newArt[row].substring(0, col) + '.' + newArt[row].substring(col + 1);
      }
    } else {
      if (newArt[row]) {
        newArt[row] = newArt[row].substring(0, col) + selectedColor + newArt[row].substring(col + 1);
      }
    }
    setArt(newArt);
  };
  

  return (
    <div>
      <div>
        {Object.keys(colors).map((color) => (
          <ColorButton
            key={color}
            onClick={() => setSelectedColor(color)}
            style={{ backgroundColor: colors[color] }}
          ></ColorButton>
        ))}
        <button onClick={() => setIsErasing(!isErasing)}>
          {isErasing ? "Drawing" : "Erasing"}
        </button>
        <button onClick={() => setArt([...art])}>Reset</button>
        <button onClick={() => saveArt()}>Save</button>
      </div>
      <div>
        {Array.from(Array(32), (_, row) => (
          <div key={row} style={{ display: "flex" }}>
            {Array.from(Array(32), (_, col) => (
              <div
                key={col}
                style={{
                  width: "12px",
                  height: "12px",
                  border: "1px solid rgba(0,0,0,0.25)",
                  backgroundColor: colors[art[row]?.[col]],
                  cursor: "pointer"
                }}
                onClick={() => handlePixelClick(row, col)}
              ></div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );  
}

export default ArtEditor;
