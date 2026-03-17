import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import rectangle from "../assets/Modal/Rectangle.svg"
import shine from "../assets/Modal/Rotated Instances.svg"

type ResultMenuProps = {
    start?: number;
    onResultTimeUp?: () => void;
};

export default function ResultMenu({ start = 5, onResultTimeUp }: ResultMenuProps) {
    const [time, setTime] = useState(start);

    useEffect(() => {
        if (time === 0) {
            onResultTimeUp?.(); // trigger notification
            return;
        }

        const timer = setInterval(() => {
            setTime((t) => t - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [time, onResultTimeUp]);

    const formatted = time.toString().padStart(2, "0");

    return (
        <div className="h-[342px] bg-gradient-to-t from-[#7C00D5] to-[#5028C1] w-[393px] rounded-t-[20px]">
            <img src={rectangle} alt="Rectangle" className="absolute left-1/2 transform -translate-x-1/2" />
            <span className="absolute  left-1/2 transform -translate-x-1/2 text-sm font-bold mt-1">Round 178 of Today</span>
            <span className="absolute h-[19px] w-[19px] mt-[5px] right-[62px] rounded-full " >
                {formatted}
            </span>
            <img src={shine} alt="Shine" className="absolute top-[57px] left-1/2 transform -translate-x-1/2" />
        </div>
    )
}


