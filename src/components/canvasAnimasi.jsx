import React, { useEffect, useRef } from 'react';

const AnimatedCanvas = () => {
  const canvasRef = useRef(null);
  const divRef = useRef(null);
  
  useEffect(() => {
    const canvas = canvasRef.current;
    const { width: divWidth, height: divHeight } = divRef.current.getBoundingClientRect();
    const ctx = canvas.getContext('2d', { willReadFrequently: true });

    canvas.width = divWidth;
    canvas.height = divHeight;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let startTime = null;
    const duration = 400;
    const startScale = 0.2;
    const endScale = 1;

    const boxPosition = { x: canvas.width / 2, y: canvas.height / 2 };
    const boxSize = { width: 300, height: 300 };

    const animationStep = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;

      const scale = startScale + (endScale - startScale) * (progress / duration);
      const currentWidth = boxSize.width * scale;
      const currentHeight = boxSize.height * scale;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.clearRect(
        boxPosition.x - currentWidth / 2,
        boxPosition.y - currentHeight / 2,
        currentWidth,
        currentHeight
      );

      if (progress < duration) {
        requestAnimationFrame(animationStep);
      } else {
        ctx.clearRect(
          boxPosition.x - boxSize.width / 2,
          boxPosition.y - boxSize.height / 2,
          boxSize.width,
          boxSize.height
        );
      }
    };

    requestAnimationFrame(animationStep);
  }, []);

  return (
    <div ref={divRef} className="flex justify-center items-center h-screen bg-gray-200">
      <canvas ref={canvasRef} />
    </div>
  );
};

export default AnimatedCanvas;
