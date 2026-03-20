import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

type LedTimerProps = {
    start?: number;
    onChooseTimeUp?: () => void;
};

export default function ChooseTimer({ start = 10, onChooseTimeUp }: LedTimerProps) {
    const [time, setTime] = useState(start);

    useEffect(() => {
        if (time === 0) {
            onChooseTimeUp?.(); // trigger notification
            return;
        }

        const timer = setInterval(() => {
            setTime((t) => t - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [time, onChooseTimeUp]);

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
                    style={{ fontFamily: "MyBoldFont" }}
                    className={`relative text-[39px] font-mono font-bold text-yellow-300 drop-shadow-[0_0_12px_#FFE600] ${time <= 5 ? "animate-pulse" : ""
                        }`}
                >
                    {formatted}
                </motion.div>
            </AnimatePresence>
        </div>
    );
}