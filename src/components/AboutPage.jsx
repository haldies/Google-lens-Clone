import { useRef, useState, useEffect } from 'react';
import html2canvas from 'html2canvas';

const CircleToSquareDrawing = () => {
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [points, setPoints] = useState([]);
  const [screenshotImage, setScreenshotImage] = useState(null);

  useEffect(() => {
    setCanvasSize();
    window.addEventListener('resize', setCanvasSize);
    return () => {
      window.removeEventListener('resize', setCanvasSize);
    };
  }, []);

  const setCanvasSize = () => {
    const canvas = canvasRef.current;
    const areaDiv = document.querySelector('.area');
    const rect = areaDiv.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
  };

  const startSnipping = () => {
    enableDrawing();
    document.getElementById('startSnippingButton').style.display = 'none';
    document.getElementById('confirmButton').style.display = 'inline';
    document.getElementById('cancelButton').style.display = 'inline';
  };

  const enableDrawing = () => {
    const canvas = canvasRef.current;
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
  };

  const startDrawing = (e) => {
    setIsDrawing(true);
    setPoints([{ x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }]);
  };

  const draw = (e) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const newPoints = [...points, { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY }];
    setPoints(newPoints);
    redrawCanvas(newPoints);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const redrawCanvas = (pointsToDraw) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (screenshotImage) {
      ctx.drawImage(screenshotImage, 0, 0, canvas.width, canvas.height);
    }

    ctx.beginPath();
    ctx.moveTo(pointsToDraw[0].x, pointsToDraw[0].y);
    for (let i = 1; i < pointsToDraw.length; i++) {
      ctx.lineTo(pointsToDraw[i].x, pointsToDraw[i].y);
    }
    ctx.closePath();
    ctx.stroke();
  };

  const confirmSnipping = () => {
    html2canvas(document.body).then(canvasScreenshot => {
      const image = new Image();
      image.src = canvasScreenshot.toDataURL();
      image.onload = () => {
        setScreenshotImage(image);
        convertToSquare();
      };
    });

    document.getElementById('confirmButton').style.display = 'none';
    document.getElementById('cancelButton').style.display = 'none';
    document.getElementById('startSnippingButton').style.display = 'inline';
  };

  const cancelSnipping = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setPoints([]);
    setScreenshotImage(null);

    document.getElementById('confirmButton').style.display = 'none';
    document.getElementById('cancelButton').style.display = 'none';
    document.getElementById('startSnippingButton').style.display = 'inline';
  };

  const convertToSquare = () => {
    if (points.length < 2) return;

    let minX = points[0].x;
    let minY = points[0].y;
    let maxX = points[0].x;
    let maxY = points[0].y;

    points.forEach(point => {
      if (point.x < minX) minX = point.x;
      if (point.y < minY) minY = point.y;
      if (point.x > maxX) maxX = point.x;
      if (point.y > maxY) maxY = point.y;
    });

    const size = Math.max(maxX - minX, maxY - minY);
    const x = minX;
    const y = minY;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(screenshotImage, 0, 0, canvas.width, canvas.height);
    ctx.beginPath();
    ctx.rect(x, y, size, size);
    ctx.stroke();

    takeSquareScreenshot(x, y, size);
  };

  const takeSquareScreenshot = (x, y, size) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const imgData = ctx.getImageData(x, y, size, size);
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.putImageData(imgData, 0, 0);

    const img = new Image();
    img.src = tempCanvas.toDataURL();
    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
  };

  return (
    <div className="layar">
      <h1>Hello World</h1>
      <div className="area">
        <div className="btn">
          <button id="startSnippingButton" onClick={startSnipping}>Start Snipping</button>
          <button id="confirmButton" style={{ display: 'none' }} onClick={confirmSnipping}>Confirm</button>
          <button id="cancelButton" style={{ display: 'none' }} onClick={cancelSnipping}>Cancel</button>
        </div>
        <canvas ref={canvasRef} id="canvas"></canvas>
      </div>
    </div>
  );
};

export default CircleToSquareDrawing;
