import { useEffect, useRef, useState } from 'react';

const PixelArtCamera = () => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [colors, setColors] = useState(["#000000", "#8d5524", "#c68642", "#e0ac69", "#f1c27d", "#ffdbac", "#FFFFFF"]);

  useEffect(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const pixelArtSize = 128;
    canvas.width = pixelArtSize;
    canvas.height = pixelArtSize;

    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true }).then(stream => {
        video.srcObject = stream;
        video.play();
      });
    }

    const renderPixelArt = () => {
      ctx.drawImage(video, 0, 0, pixelArtSize, pixelArtSize);
      let imageData = ctx.getImageData(0, 0, pixelArtSize, pixelArtSize);
      let data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        let r = data[i];
        let g = data[i + 1];
        let b = data[i + 2];
        
        let closestColor = findClosestColor(r, g, b, colors);
        data[i]     = closestColor[0];
        data[i + 1] = closestColor[1];
        data[i + 2] = closestColor[2];
      }

      ctx.putImageData(imageData, 0, 0);
    };

    const interval = setInterval(renderPixelArt, 100);

    return () => clearInterval(interval);
  }, [colors]);

  const findClosestColor = (r, g, b, colors) => {
    let closest = null;
    let closestDistance = Infinity;
    for (let i = 0; i < colors.length; i++) {
      let color = hexToRgb(colors[i]);
      let distance = colorDistance(r, g, b, color.r, color.g, color.b);
      if (distance  < closestDistance) {
        closestDistance = distance;
        closest = color;
      }
    }
    return [closest.r, closest.g, closest.b];
  };

  const colorDistance = (r1, g1, b1, r2, g2, b2) => {
    return Math.sqrt(Math.pow(r2 - r1, 2) + Math.pow(g2 - g1, 2) + Math.pow(b2 - b1, 2));
  };

  const hexToRgb = (hex) => {
    let bigint = parseInt(hex.slice(1), 16);
    let r = (bigint >> 16) & 255;
    let g = (bigint >> 8) & 255;
    let b = bigint & 255;
    return { r, g, b };
  };

  const handleColorChange = (index, newColor) => {
    const newColors = [...colors];
    newColors[index] = newColor;
    setColors(newColors);
  };

  return (
    <div>
      <video ref={videoRef} autoPlay style={{ opacity: 0, width: 0, height: 0 }}></video>
      <canvas ref={canvasRef} style={{ border: '1px solid black', margin: '10px', imageRendering: 'pixelated', width: '256px', height: '256px' }}></canvas>
      <div>
        {colors.map((color, index) => (
          <input
            key={index}
            type="color"
            value={color}
            onChange={(e) => handleColorChange(index, e.target.value)}
          />
        ))}
      </div>
    </div>
  );
};

export default PixelArtCamera;
