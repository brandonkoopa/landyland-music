import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.width}, 1fr);
  grid-template-rows: repeat(${(props) => props.height}, 1fr);
  grid-gap: 1px;
  background-color: #f0f0f0;
`;

const Pixel = styled.div`
  background-color: ${(props) => props.color || 'transparent'};
  height: 100%;
  width: 100%;
`;

const ArtEditor = ({ art, setArt, width, height }) => {
  const [selectedColor, setSelectedColor] = useState('black');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const prevPixelRef = useRef();

  useEffect(() => {
    prevPixelRef.current = null;
  }, [isDrawing, isErasing]);

  const handlePixelClick = (row, col) => {
    let newArt = [...art];
    if (isErasing) {
      newArt[row][col] = 'transparent';
    } else {
      newArt[row][col] = selectedColor;
    }
    setArt(newArt);
  };

  const handlePixelDrag = (row, col) => {
    if (!isDrawing) return;
    let newArt = [...art];
    if (prevPixelRef.current) {
      const [prevRow, prevCol] = prevPixelRef.current;
      const dx = col - prevCol;
      const dy = row - prevRow;
      const steps = Math.max(Math.abs(dx), Math.abs(dy));
      for (let i = 0; i < steps; i++) {
        const r = Math.round(prevRow + i * dy / steps);
        const c = Math.round(prevCol + i * dx / steps);
        if (r >= 0 && r < height && c >= 0 && c < width) {
          if (isErasing) {
            newArt[r][c] = 'transparent';
          } else {
            newArt[r][c] = selectedColor;
          }
        }
      }
    } else {
      handlePixelClick(row, col);
    }
    prevPixelRef.current = [row, col];
    setArt(newArt);
  };

  return (
    <>
      <div>
        <input
          type="color"
          value={selectedColor}
          onChange={(e) => setSelectedColor(e.target.value)}
        />
        <button onClick={() => setIsErasing(!isErasing)}>
          {isErasing ? 'Drawing' : 'Erasing'}
        </button>
        <button onClick={() => setArt([...art])}>Reset</button>
        <button onClick={() => saveArt()}>Save</button>
      </div>
      <Grid
        width={width}
        height={height}
        onMouseDown={() => setIsDrawing(true)}
        onMouseUp={() => {
          setIsDrawing(false);
          prevPixelRef.current = null;
        }}
        onMouseLeave={() => {
          setIsDrawing(false);
          prevPixelRef.current = null;
        }}
      >
        {art.map((row, rowIndex) =>
          row.map((color, colIndex) => (
            <Pixel
              key={`${rowIndex},${colIndex}`}
              color={color}
              onMouseEnter={() => handlePixelDrag(rowIndex, colIndex)}
              onClick={() => handlePixelClick(rowIndex, colIndex)}
            />
          ))
        )}
      </Grid>
    </>
  );
};

export default ArtEditor
