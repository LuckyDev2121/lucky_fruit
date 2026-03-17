import { useEffect, useState } from "react";

type HiddenTimerProps = {
    start?: number;
    onHiddenTimeUp?: () => void;
};

export default function HiddenTimer({ start = 5, onHiddenTimeUp }: HiddenTimerProps) {
    const [time, setTime] = useState(start);

    useEffect(() => {
        if (time === 0) {
            onHiddenTimeUp?.(); // trigger notification
            return;
        }

        const timer = setInterval(() => {
            setTime((t) => t - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [time, onHiddenTimeUp]);
    return (
        <div>
        </div>
    );
}