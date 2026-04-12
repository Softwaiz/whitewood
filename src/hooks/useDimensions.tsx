import { useCallback, useEffect, useState } from "react";

export function useDimensions(ref: React.RefObject<HTMLElement | null>) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });

    const handleResize = useCallback(() => {
        if (ref.current) {
            const { width, height } = ref.current.getBoundingClientRect();
            setDimensions({ width, height });
        }
    }, [ref]);

    useEffect(() => {
        handleResize(); // Initial measurement

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    return dimensions;
}

export function useDimensionsWithRect(ref: React.RefObject<HTMLElement | null>) {
    const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
    const [rect, setRect] = useState<DOMRect | null>(null);

    const handleResize = useCallback(() => {
        if (ref.current) {
            const rect = ref.current.getBoundingClientRect();
            setDimensions({ width: rect.width, height: rect.height });
            setRect(rect);
        }
    }, [ref]);

    useEffect(() => {
        handleResize(); // Initial measurement

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [handleResize]);

    return { dimensions, rect };
}