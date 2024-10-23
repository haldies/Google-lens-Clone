export const drawOnCanvas = (canvas, pointsToDraw) => {
    if (canvas && pointsToDraw.length > 1) {
        const ctx = canvas.getContext('2d');

        ctx.strokeStyle = 'white';
        ctx.lineWidth = 5;
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.imageSmoothingEnabled = true;

        ctx.shadowBlur = 2;
        ctx.shadowColor = 'rgba(255, 255, 255, 0.5)';

        ctx.beginPath();
        ctx.moveTo(pointsToDraw[0].x, pointsToDraw[0].y);

        for (let i = 1; i < pointsToDraw.length - 2; i++) {
            const xc = (pointsToDraw[i].x + pointsToDraw[i + 1].x) / 2;
            const yc = (pointsToDraw[i].y + pointsToDraw[i + 1].y) / 2;
            ctx.quadraticCurveTo(pointsToDraw[i].x, pointsToDraw[i].y, xc, yc);
        }

        ctx.lineTo(pointsToDraw[pointsToDraw.length - 1].x, pointsToDraw[pointsToDraw.length - 1].y);

        ctx.stroke();

        ctx.globalCompositeOperation = 'multiply';
        ctx.filter = 'blur(1px)';
        ctx.stroke();

        ctx.globalCompositeOperation = 'source-over';
        ctx.filter = 'none';
    }
};

export const clearCanvas = (canvas) => {
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
};
