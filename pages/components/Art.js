import { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';

const colors = {
  'W': '#FFF',
  '0': '#000',
  'R': '#CD0E2D',
  'G': '#20C25D',
  'B': '#203EC2',
  'Y': '#EEB949'
};

const defaultArt = [
  '. . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . .',
  '. . . . . . . . . . . . . . . .'
];

const ArtHolder = styled.div`
  height: ${(props) => props.height}px;
  overflow: hidden;
  width: ${(props) => props.height}px;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(${(props) => props.width}, 1fr);
  grid-template-rows: repeat(${(props) => props.height}, 1fr);
  grid-gap: 0;
  background-color: #f0f0f0;
`;

const Pixel = styled.div`
  background-color: ${(props) => colors[props.color] || 'transparent'};
  width: 100%;
  padding-bottom: 100%;
`;

const Art = ({ art, editable=false, setArt, width = 32, height = 32 }) => {
  const pixels = Array.isArray(art?.pixels) ? art.pixels : defaultArt;

  const [selectedColor, setSelectedColor] = useState('0');
  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);
  const prevPixelRef = useRef();

  useEffect(() => {
    prevPixelRef.current = null;
  }, [isDrawing, isErasing]);

  const handlePixelClick = (row, col) => {
    const newPixels = [...pixels];
    const pixelRow = newPixels[row];

    const color = isErasing ? '.' : selectedColor

    const newRow = pixelRow.slice(0, col) + color + pixelRow.slice(col + 1);
    newPixels[row] = newRow;

    const newArt = {
      ...art,
      pixels: newPixels,
    };

    setArt(newArt);
  };

  const handlePixelDrag = (row, col) => {
    if (!isDrawing) return;
  
    const pixelIndex = row * (width + 1) + col;
    const newPixels = [...pixels];
  
    if (isErasing) {
      newPixels[pixelIndex] = '.';
    } else {
      newPixels[pixelIndex] = selectedColor;
    }
  
    setArt({ ...art, pixels: newPixels });
  };

  return (
    <ArtHolder width={width} height={height} >
      { editable &&
      <div>
        {Object.keys(colors).map((key) => (
          <button
            key={key}
            style={{
              backgroundColor: colors[key],
              padding: '5px',
              margin: '5px',
              border: selectedColor === key ? '2px solid #000' : 'none'
            }}
            onClick={() => setSelectedColor(key)}
          >
            {key}
          </button>
        ))}
        <button onClick={() => setIsErasing(!isErasing)}>
          {isErasing ? 'Draw' : 'Erase'}
        </button>
        <button
          onClick={() =>
            setArt({
              ...art,
              pixels: Array(height)
                .fill('.')
                .join('')
            })
          }
        >
          Reset
        </button>
        <button onClick={() => saveArt()}>Save</button>
      </div>
      }
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
        {pixels.map((row, rowIndex) => (
          <div key={rowIndex}>
            {Array.from(row).map((color, colIndex) => (
              <Pixel
                key={`${rowIndex},${colIndex}`}
                color={color}
                onMouseEnter={() => handlePixelDrag(rowIndex, colIndex)}
                onClick={() => handlePixelClick(rowIndex, colIndex)}
              />
            ))}
          </div>
        ))}
      </Grid>
    </ArtHolder>
  );
};

export default Art;
