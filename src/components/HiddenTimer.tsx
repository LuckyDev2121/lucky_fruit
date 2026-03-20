import { useEffect, useRef } from "react";

type HiddenTimerProps = {
    start?: number;
    onHiddenTimeUp?: () => void;
};

export default function HiddenTimer({ start = 5, onHiddenTimeUp }: HiddenTimerProps) {
    const onHiddenTimeUpRef = useRef(onHiddenTimeUp);

    useEffect(() => {
        onHiddenTimeUpRef.current = onHiddenTimeUp;
    }, [onHiddenTimeUp]);

    useEffect(() => {
        if (start <= 0) {
            onHiddenTimeUpRef.current?.();
            return;
        }

        const timer = window.setTimeout(() => {
            onHiddenTimeUpRef.current?.();
        }, start * 1000);

        return () => window.clearTimeout(timer);
    }, [start]);

    return (
        <div>
        </div>
    );
}
