import React, { useState } from 'react';

const PixelArtEditor = ({ width = 20, height = 20 }) => {
  const [pixels, setPixels] = useState(() => {
    const pixelArray = new Array(width * height).fill(0);
    return pixelArray;
  });

  const [isDrawing, setIsDrawing] = useState(false);
  const [isErasing, setIsErasing] = useState(false);

  const handleMouseDown = (index, e) => {
    if (e.button === 0) { // Only draw if left mouse button is pressed
      if (isErasing) {
        handlePixelChange(index, false);
      } else {
        setIsDrawing(true);
        handlePixelChange(index, true);
      }
    }
  };

  const handleMouseMove = (index, e) => {
    if (isDrawing && e.buttons === 1) { // Only draw while left mouse button is pressed
      handlePixelChange(index, true);
    } else if (isErasing && e.buttons === 1) { // Only erase while left mouse button is pressed
      handlePixelChange(index, false);
    }
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
    setIsErasing(false);
  };

  const handlePixelChange = (index, value) => {
    setPixels((prevPixels) => {
      const newPixels = [...prevPixels];
      newPixels[index] = value ? 1 : 0;
      return newPixels;
    });
  };

  const handleErase = () => {
    setIsErasing(true);
  };

  const handleDraw = () => {
    setIsErasing(false);
  };

  return (
    <div>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${width}, 1fr)`,
          gap: 1,
          backgroundColor: '#eee',
          padding: 10,
          borderRadius: 5,
        }}
      >
        {pixels.map((value, index) => (
          <div
            key={index}
            style={{
              backgroundColor: value === 1 ? '#333' : '#fff',
              width: '100%',
              height: '100%',
              cursor: 'pointer',
            }}
            onMouseDown={(e) => handleMouseDown(index, e)}
            onMouseMove={(e) => handleMouseMove(index, e)}
            onMouseUp={handleMouseUp}
          />
        ))}
      </div>
      <div style={{ marginTop: 10 }}>
        <button onClick={handleDraw}>Draw</button>
        <button onClick={handleErase}>Erase</button>
      </div>
    </div>
  );
};

export default PixelArtEditor;
