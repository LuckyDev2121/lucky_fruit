import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LedTimerProps = {
    start?: number;
    onLedTimeUp?: () => void;
};

export default function LedTimer({ start = 40, onLedTimeUp }: LedTimerProps) {
    const [time, setTime] = useState(start);

    useEffect(() => {
        if (time === 0) {
            onLedTimeUp?.(); // trigger notification
            return;
        }

        const timer = setInterval(() => {
            setTime((t) => t - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [time, onLedTimeUp]);

    const formatted = time.toString().padStart(2, "0");

    return (
        <div>
            <AnimatePresence mode="wait">
                <motion.div
                    key={time}
                    initial={{ opacity: 1, scale: 1 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 1 }}
                    // transition={{ duration: 1 }}
                    style={{ fontFamily: "Digital7" }}
                    className={`relative text-[70px] font-mono font-bold text-yellow-300 drop-shadow-[0_0_12px_#FFE600] ${time <= 5 ? "animate-pulse" : ""
                        }`}
                >
                    {formatted}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}