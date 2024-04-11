import React, { useEffect, useRef } from 'react';

const SoundBars = ({ volume }) => {
  const canvasRef = useRef(null);
  const barWidth = 10;
  const barSpacing = 5;
  const numBars = 10;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < numBars; i++) {
        const barHeight = (volume * canvas.height) / numBars;
        const x = i * (barWidth + barSpacing);
        const y = canvas.height - barHeight;
        const hue = (i / numBars) * 360;
        ctx.fillStyle = `hsl(${hue}, 100%, 50%)`;
        ctx.fillRect(x, y, barWidth, barHeight);
      }
    };

    draw();
  }, [volume]);

  return <canvas ref={canvasRef} />;
};

export default SoundBars;
