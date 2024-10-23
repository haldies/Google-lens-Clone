import  { useRef, useEffect, useState } from 'react';

const ImageCanvas = () => {
    const canvasRef = useRef(null);
    const divRef = useRef(null);
    const divkotak = useRef(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [boxPosition, setBoxPosition] = useState({ x: 260, y: 190 });
    const [boxSize, setBoxSize] = useState({ width: 70, height: 70 });
    const [resizeHandle, setResizeHandle] = useState('');

    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        const { width: divWidth, height: divHeight } = divRef.current.getBoundingClientRect();

        canvas.width = divWidth;
        canvas.height = divHeight;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        clearBox(ctx, boxPosition.x, boxPosition.y, boxSize.width, boxSize.height);

        const handleMouseDown = (e) => {
            const mouseX = getClientX(e);
            const mouseY = getClientY(e);

            if (
                mouseX >= boxPosition.x &&
                mouseX <= boxPosition.x + boxSize.width &&
                mouseY >= boxPosition.y &&
                mouseY <= boxPosition.y + boxSize.height
            ) {
                setIsDragging(true);
            }
        };

        const handleMouseMove = (e) => {
            if (isDragging) {
                const mouseX = getClientX(e);
                const mouseY = getClientY(e);

                setBoxPosition({ x: mouseX - boxSize.width / 2, y: mouseY - boxSize.height / 2 });
            } else if (isResizing) {
                const mouseX = getClientX(e);
                const mouseY = getClientY(e);

                let newWidth = boxSize.width;
                let newHeight = boxSize.height;
                let newX = boxPosition.x;
                let newY = boxPosition.y;

                switch (resizeHandle) {
                    case 'nw':
                        newWidth = boxPosition.x + boxSize.width - mouseX;
                        newHeight = boxPosition.y + boxSize.height - mouseY;
                        newX = mouseX;
                        newY = mouseY;
                        break;
                    case 'ne':
                        newWidth = mouseX - boxPosition.x;
                        newHeight = boxPosition.y + boxSize.height - mouseY;
                        newY = mouseY;
                        break;
                    case 'sw':
                        newWidth = boxPosition.x + boxSize.width - mouseX;
                        newHeight = mouseY - boxPosition.y;
                        newX = mouseX;
                        break;
                    case 'se':
                        newWidth = mouseX - boxPosition.x;
                        newHeight = mouseY - boxPosition.y;
                        break;
                }

                setBoxSize({ width: Math.max(50, newWidth), height: Math.max(50, newHeight) });
                setBoxPosition({ x: newX, y: newY });
            }
        };

        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
        };

        const getClientX = (e) => {
            if (e.clientX !== undefined) {
                return e.clientX - canvas.getBoundingClientRect().left;
            } else if (e.touches && e.touches.length > 0) {
                return e.touches[0].clientX - canvas.getBoundingClientRect().left;
            }
            return 0;
        };

        const getClientY = (e) => {
            if (e.clientY !== undefined) {
                return e.clientY - canvas.getBoundingClientRect().top;
            } else if (e.touches && e.touches.length > 0) {
                return e.touches[0].clientY - canvas.getBoundingClientRect().top;
            }
            return 0;
        };

        canvas.addEventListener('mousedown', handleMouseDown);
        canvas.addEventListener('touchstart', handleMouseDown);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('touchstart', handleMouseDown);
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleMouseUp);
        };

    }, [isDragging, isResizing, boxPosition, boxSize, resizeHandle]);

    const clearBox = (ctx, x, y, width, height) => {
        ctx.clearRect(x, y, width, height);

    };

    const handleResizeStart = (handle) => (e) => {
        e.stopPropagation();
        setIsResizing(true);
        setResizeHandle(handle);
    };

    return (
        <div className="flex justify-center items-center">
            <div className="relative w-96 h-96">
                <div className="w-full h-full">
                    <img src="https://www.ahstatic.com/photos/5451_ho_00_p_1024x768.jpg" className="w-full h-full" alt="Your image" />
                </div>
                <div className="top-0 absolute w-full h-full" ref={divRef}>
                    <canvas ref={canvasRef} className="absolute"></canvas>
                </div>
                <div
                    aria-label="ini adalah kotak clear"
                    className="absolute"
                    ref={divkotak}
                    style={{
                        left: boxPosition.x,
                        top: boxPosition.y,
                        width: boxSize.width,
                        height: boxSize.height
                    }}
                >
                    <div
                        style={{ width: '100%', height: '100%', cursor: 'move', position: 'relative', }}
                        onMouseDown={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onTouchStart={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}

                    >
                        {/* Clear Box */}
                        <div className="absolute w-6 h-6 overflow-hidden  cursor-nw-resize  " style={{ top: -8, left: -8 }} onMouseDown={handleResizeStart('nw')}>
                            <div className="h-12 w-12 rounded-full border-8 border-white">

                            </div>
                        </div>
                        <div className="absolute w-6 h-6  overflow-hidden cursor-ne-resize" style={{ top: -8, right: -8 }} onMouseDown={handleResizeStart('ne')}>
                            <div className="h-12 w-12 absolute rounded-full border-8 border-white right-0">

                            </div>
                        </div>
                        <div className="absolute w-6 h-6  overflow-hidden cursor-sw-resize" style={{ bottom: -8, left: -8 }} onMouseDown={handleResizeStart('sw')}>
                            <div className="h-12 w-12 absolute rounded-full border-8 border-white  left-0 bottom-0">

                            </div>
                        </div>
                        <div className="absolute w-6 h-6  overflow-hidden cursor-se-resize" style={{ bottom: -8, right: -8 }} onMouseDown={handleResizeStart('se')}>
                            <div className="h-12 w-12 absolute rounded-full border-8 border-white right-0 bottom-0">
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default ImageCanvas;