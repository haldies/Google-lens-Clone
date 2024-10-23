import { useRef, useState, useEffect } from "react";
import html2canvas from "html2canvas";
import { EllipsisVertical, X } from 'lucide-react';
import Drawer from "../Drawer";
import ProdukDrawer from "../Produk";
import { ClearBoxCirle } from "../libaryGoogleLens/ClearBoxCirle";
import { clearCanvas, drawOnCanvas } from "./hooks/canvasUtils";

const CircleSearch = ({ children }) => {
    const canvasRef = useRef(null);
    const containerRef = useRef(null);
    const contentRef = useRef(null);
    const [isSnipping, setIsSnipping] = useState(false);
    const [touchPosition, setTouchPosition] = useState({ x: 0, y: 0 });
    const [isDrawing, setIsDrawing] = useState(false);
    const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
    const [points, setPoints] = useState([]);

    const [rectangle, setRectangle] = useState(null);
    const holdTimeout = useRef(null);
    const [isOpen, setIsOpen] = useState(false)
    const [isTouching, setIsTouching] = useState(false);
    const googleButtonRef = useRef(null);


    useEffect(() => {
        const updateCanvasSize = () => {
            if (isSnipping && containerRef.current) {
                const { width, height } = containerRef.current.getBoundingClientRect();
                setCanvasSize({ width, height });
                console.log("Snipping started, canvas size set:", { width, height });
            }
        };

        updateCanvasSize();
        window.addEventListener('resize', updateCanvasSize);
        return () => {
            window.removeEventListener('resize', updateCanvasSize);
        };


    }, [isSnipping]);

    useEffect(() => {
        let animationFrameId;

        function animate(ctx, centerX, centerY, maxRadius, onComplete) {
            let radius = 0;
            const speed = 30;
            const minOpacity = 0.1;
            const maxOpacity = 0.5;

            function frame() {
                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

                const progress = radius / maxRadius;
                const opacity = minOpacity + (maxOpacity - minOpacity) * (1 - progress);

                ctx.fillStyle = `rgba(59, 130, 246, ${opacity})`;
                ctx.beginPath();
                ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
                ctx.fill();

                radius += speed;

                if (radius < maxRadius) {
                    animationFrameId = requestAnimationFrame(frame);
                } else {
                    onComplete();
                }
            }

            frame();
        }

        if (isSnipping && canvasRef.current && canvasSize.width && canvasSize.height) {
            const canvas = canvasRef.current;
            canvas.width = canvasSize.width;
            canvas.height = canvasSize.height;
            const ctx = canvas.getContext('2d');

            const maxRadius = Math.sqrt(Math.pow(canvasSize.width, 2) + Math.pow(canvasSize.height, 2));

            const buttonRect = googleButtonRef.current.getBoundingClientRect();
            const buttonX = buttonRect.left + buttonRect.width / 2;
            const buttonY = buttonRect.top + buttonRect.height / 2;

            animate(ctx, buttonX, buttonY, maxRadius, () => {
                // console.log("Animasi selesai");
            });
        }

        return () => {
            if (animationFrameId) {
                cancelAnimationFrame(animationFrameId);
            }
        };
    }, [isSnipping, canvasSize]);

    const handleScroll = (e) => {
        e.preventDefault();
    };

    const startPaint = () => {
        setIsSnipping(true);
        document.documentElement.style.overflow = 'hidden';
    };

    const cancelPaint = () => {
        document.removeEventListener('touchmove', handleScroll, { passive: false });
        setTimeout(() => {
            document.documentElement.style.overflow = 'auto';
            document.body.style.overflow = 'auto';
        }, 0)

        setIsSnipping(false);
        clearCanvas();
        setIsOpen(false)
        setRectangle(null);
        // console.log("Snipping mode cancelled");
    };

    const getTouchPosition = (e) => {
        return {
            x: e.touches ? e.touches[0].clientX : e.clientX,
            y: e.touches ? e.touches[0].clientY : e.clientY
        };
    };


    const startDrawing = (e) => {
        if (rectangle) return;
        setIsDrawing(true);
        const newPoint = getEventPosition(e);
        setPoints([newPoint]);
        drawOnCanvas(canvasRef.current, [newPoint]);
        setIsTouching(true);
        setTouchPosition(getTouchPosition(e));
        // console.log("Started drawing at point:", newPoint);
    };


    const draw = (e) => {
        if (!isDrawing) return;
        const newPoint = getEventPosition(e);
        setPoints(prevPoints => [...prevPoints, newPoint]);
        drawOnCanvas(canvasRef.current, [...points, newPoint]);
        if (isTouching) {
            setTouchPosition(getTouchPosition(e));
        }
    };

    const endDrawing = () => {
        setIsDrawing(false);
        if (points.length > 0) {
            // console.log("Drawing ended, points captured:", points);
            captureScreenshot();
        }
    };



    const captureScreenshot = () => {
        const minX = Math.min(...points.map(p => p.x));
        const minY = Math.min(...points.map(p => p.y));
        const maxX = Math.max(...points.map(p => p.x));
        const maxY = Math.max(...points.map(p => p.y));

        const width = maxX - minX;
        const height = maxY - minY;
        

        const scrollY = window.pageYOffset;

        setIsTouching(false);

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        const prevFillStyle = ctx.fillStyle;

        canvas.style.pointerEvents = 'none';

        html2canvas(document.body, {
            x: minX,
            y: minY + scrollY,
            width: width,
            height: height,
            useCORS: true,
            logging: true,
            ignoreElements: element => element === canvas
        }).then(canvas => {
            const dataURL = canvas.toDataURL();
            console.log("Cropped image data URL:", dataURL);

            ctx.fillStyle = prevFillStyle;

            canvas.style.pointerEvents = 'auto';

            const rect = { x: minX, y: minY, width, height };

            setRectangle(rect);
            drawRectangle(rect.x, rect.y, rect.width, rect.height);
            // console.log("Rectangle drawn on canvas:", rect);
            setPoints([]);
            setIsOpen(true)
        }).catch(error => {
            console.error("Error capturing screenshot:", error);
        });
    };

    const drawRectangle = (x, y, width, height) => {
        const canvas = canvasRef.current;
        if (canvas) {
            const ctx = canvas.getContext('2d');
            ctx.clearRect(x, y, width, height);
        }
    };

    const getEventPosition = (e) => {
        if (e.touches) {
            return { x: e.touches[0].clientX, y: e.touches[0].clientY };
        } else {
            return { x: e.nativeEvent.offsetX, y: e.nativeEvent.offsetY };
        }
    };

    const handleMouseDown = () => {
        holdTimeout.current = setTimeout(() => {
            startPaint();
        }, 300);
    };

    const handleMouseUp = () => {
        clearTimeout(holdTimeout.current);
    };

    const handleTouchStart = () => {
        holdTimeout.current = setTimeout(() => {
            startPaint();
        }, 300);
    };

    const handleTouchEnd = () => {
        clearTimeout(holdTimeout.current);
    };



    return (
        <div className="relative">
            <div ref={contentRef}>
                {children}
            </div>
            <div
                ref={containerRef}
                className={`fixed w-full h-screen inset-0 flex items-center justify-center ${isSnipping ? '' : 'hidden'}`}
                style={{ zIndex: 9998 }}
            >
                <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={endDrawing}
                    onMouseLeave={endDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={endDrawing}
                ></canvas>

                <ClearBoxCirle
                    boxPosition={{ x: rectangle?.x || 0, y: rectangle?.y || 0 }}
                    boxSize={{ width: rectangle?.width || 0, height: rectangle?.height || 0 }}
                    onDragStart={() => { }}
                    onResizeStart={() => { }}
                    animateClearBox={false} />


                {isTouching && (
                    <div
                        className="absolute bg-blue-500 rounded-full blur-lg opacity-75"
                        style={{
                            top: touchPosition.y - 25,
                            left: touchPosition.x - 25,
                            width: 50,
                            height: 50,
                            pointerEvents: 'none'
                        }}
                    ></div>
                )}

                {isSnipping && (
                    <>
                        <button
                            className="absolute top-6 left-6 p-2 rounded"
                            onClick={cancelPaint}
                        >
                            <X color="#ffffff" size={30} />
                        </button>
                        <p
                            className="absolute top-6 left-1/2 p-2 text-white text-2xl font-semibold  transform -translate-x-1/2"
                        >
                            Google
                        </p>
                        <button
                            className="absolute top-6 right-6  p-2 rounded"
                            onClick={cancelPaint}
                        >
                            <EllipsisVertical color="#ffffff" />
                        </button>
                    </>
                )}
            </div>

            <div className="fixed bottom-12 left-1/2 transform -translate-x-1/2" style={{ zIndex: 9999 }}>
                <div className="border flex items-center justify-center bg-white shadow-md  rounded-full  hover:bg-slate-300">
                    <button
                        className="flex justify-center items-center w-40 h-12 gap-3   font-semibold"
                        ref={googleButtonRef}
                        onMouseDown={handleMouseDown}
                        onMouseUp={handleMouseUp}
                        onMouseLeave={handleMouseUp}
                        onTouchStart={handleTouchStart}
                        onTouchEnd={handleTouchEnd}
                        onTouchCancel={handleTouchEnd}
                        disabled={rectangle !== null}
                    >
                        Google
                    </button>
                </div>
            </div>
            <Drawer isOpen={isOpen}>
                <ProdukDrawer />
            </Drawer>
        </div>
    );
};

export default CircleSearch;
