import { useState, useEffect, useRef } from 'react';
import { useDrag } from '@use-gesture/react';
import { useSpring, animated } from 'react-spring';

const Drawer = ({ children, isOpen }) => {
    const initialY = window.innerHeight * 0.5;
    const [y, setY] = useState(initialY);
    const startY = useRef(initialY);
    const lastY = useRef(initialY);

    const [{ top }, api] = useSpring(() => ({ top: initialY }));

    useEffect(() => {
        if (isOpen) {
            const targetY = lastY.current;
            setY(targetY);
            startY.current = targetY;
            api.start({ top: targetY });
        }
    }, [isOpen, api]);

    const bind = useDrag((state) => {
        const newY = startY.current + state.movement[1];
        const minY = window.innerHeight * 0.1;
        const maxY = window.innerHeight * 0.8;
        const clampedY = Math.max(minY, Math.min(newY, maxY));
        
        setY(clampedY);
        api.start({ top: clampedY });
        
        if (state.last) {
            lastY.current = clampedY;
            startY.current = clampedY;
        }
    }, {
        from: () => [0, y],
        bounds: { top: window.innerHeight * 0.1, bottom: window.innerHeight * 0.8 }
    });

    return (
        <>
            {isOpen && (
                <animated.div
                    {...bind()}
                    className="fixed bottom-0 left-0 right-0 z-40 p-4 h-[90%] w-full bg-white transform-none border rounded-3xl shadow-2xl"
                    style={{
                        top,
                        touchAction: 'none',
                        zIndex: 10000
                    }}
                >
                    <div className="handleDrag flex justify-center">
                        <div className="h-3 bg-slate-400 w-20 rounded-2xl mb-3"></div>
                    </div>

                    <div className="h-[95%] overflow-y-auto border">
                        {children}
                    </div>
                </animated.div>
            )}
        </>
    );
};

export default Drawer;