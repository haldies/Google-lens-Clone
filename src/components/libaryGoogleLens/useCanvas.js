import { useState, useEffect, useCallback, useRef } from 'react';

export const useCanvas = (canvasRef, divRef, initialBoxPosition, initialBoxSize, imageSrc) => {
    const [boxPosition, setBoxPosition] = useState(initialBoxPosition);
    const [boxSize, setBoxSize] = useState(initialBoxSize);
    const [isDragging, setIsDragging] = useState(false);
    const [isResizing, setIsResizing] = useState(false);
    const [resizeHandle, setResizeHandle] = useState('');
    const [croppedImageUrl, setCroppedImageUrl] = useState(null);
    const [cropTriggered, setCropTriggered] = useState(false);
    const originalImageRef = useRef(null);
    const [isAnimate, setIsAnimate] = useState(false);


    const clearBox = useCallback((ctx, x, y, width, height) => {
        ctx.clearRect(x, y, width, height);
    }, []);


    const cropImage = useCallback(async () => {
        if (!originalImageRef.current) return null;

        const originalImage = originalImageRef.current;
        const canvasElement = canvasRef.current;

        const scaleX = originalImage.naturalWidth / canvasElement.width;
        const scaleY = originalImage.naturalHeight / canvasElement.height;


        const scaledX = Math.round(boxPosition.x * scaleX);
        const scaledY = Math.round(boxPosition.y * scaleY);
        const scaledWidth = Math.round(boxSize.width * scaleX);
        const scaledHeight = Math.round(boxSize.height * scaleY);



        const canvas = document.createElement('canvas');
        canvas.width = scaledWidth;
        canvas.height = scaledHeight;
        const ctx = canvas.getContext('2d', { willReadFrequently: true });

        ctx.drawImage(
            originalImage,
            scaledX, scaledY, scaledWidth, scaledHeight,
            0, 0, scaledWidth, scaledHeight
        );

        try {
            const blob = await new Promise((resolve, reject) => {
                canvas.toBlob((blob) => {
                    if (!blob) {
                        reject(new Error('Failed to create blob.'));
                        return;
                    }
                    resolve(blob);
                }, 'image/jpeg', 0.8);
            });


            const imageUrl = URL.createObjectURL(blob);

            setCroppedImageUrl(imageUrl);

        } catch (error) {
            console.error('Error cropping image:', error);
            return null;
        } finally {
            setCropTriggered(false);
        }
    }, [boxPosition, boxSize, canvasRef]);


    useEffect(() => {
        const canvas = canvasRef.current;
        const { width: divWidth, height: divHeight } = divRef.current.getBoundingClientRect();
        const ctx = canvas.getContext('2d', { willReadFrequently: true });


        canvas.width = divWidth;
        canvas.height = divHeight;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';



        ctx.fillRect(0, 0, canvas.width, canvas.height);


        let startTime = null;
        const duration = 640;
        const startScale = 0.2;
        const endScale = 1;

        const animationStep = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = timestamp - startTime;
            const scale = startScale + (endScale - startScale) * (progress / duration);

            const currentWidth = boxSize.width * scale;
            const currentHeight = boxSize.height * scale;

            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Calculate the position with the scale in mind
            const x = boxPosition.x + (boxSize.width - currentWidth) / 2;
            const y = boxPosition.y + (boxSize.height - currentHeight) / 2;

            ctx.clearRect(x, y, currentWidth, currentHeight);

            if (progress < duration) {
                requestAnimationFrame(animationStep);
            }
        };

        if (isAnimate) {
            requestAnimationFrame(animationStep);
            setIsAnimate(false)
        }


        ctx.clearRect(boxPosition.x, boxPosition.y, boxSize.width, boxSize.height);

        const img = new Image();

        img.onload = () => {
            originalImageRef.current = img;

            const canvas = canvasRef.current;
            const maxWidth = canvas.width;
            const maxHeight = canvas.height;

            const scaleRatio = Math.min(maxWidth / img.naturalWidth, maxHeight / img.naturalHeight);


            const newWidth = img.naturalWidth * scaleRatio;
            const newHeight = img.naturalHeight * scaleRatio;

            img.width = newWidth;
            img.height = newHeight;

        };


        img.src = imageSrc;

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

                let newX = mouseX - boxSize.width / 2;
                let newY = mouseY - boxSize.height / 2;

                newX = Math.max(0, Math.min(newX, canvas.width - boxSize.width));
                newY = Math.max(0, Math.min(newY, canvas.height - boxSize.height));

                setBoxPosition({ x: newX, y: newY });

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

                newWidth = Math.max(50, Math.min(newWidth, canvas.width - newX));
                newHeight = Math.max(50, Math.min(newHeight, canvas.height - newY));
                newX = Math.max(0, Math.min(newX, canvas.width - newWidth));
                newY = Math.max(0, Math.min(newY, canvas.height - newHeight));

                setBoxSize({ width: newWidth, height: newHeight });
                setBoxPosition({ x: newX, y: newY });

            }
        };
        const handleMouseUp = () => {
            setIsDragging(false);
            setIsResizing(false);
            if (!cropTriggered) {
                setCropTriggered(true);
                setTimeout(() => {
                    cropImage();
                    setCropTriggered(false);
                }, 1000)

            }
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
        canvas.addEventListener('touchstart', handleMouseDown, { passive: true });
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('touchmove', handleMouseMove, { passive: true });
        document.addEventListener('mouseup', handleMouseUp);
        document.addEventListener('touchend', handleMouseUp);

        return () => {
            canvas.removeEventListener('mousedown', handleMouseDown);
            canvas.removeEventListener('touchstart', handleMouseDown, { passive: true });
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('touchmove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('touchend', handleMouseUp);
        };

    }, [isDragging, isResizing, boxPosition, boxSize, resizeHandle, canvasRef, divRef, clearBox, imageSrc, cropImage, cropTriggered, isAnimate]);


    return {
        boxPosition,
        setBoxPosition,
        boxSize,
        setBoxSize,
        isDragging,
        setIsDragging,
        isResizing,
        setIsResizing,
        resizeHandle,
        setResizeHandle,
        clearBox,
        croppedImageUrl,
        cropImage,
        setIsAnimate
    };
};