import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import rectangle from "../assets/Modal/Rectangle.svg"
import shine from "../assets/Modal/RotatedInstances.svg"
import cherry from "../assets/fruits/cherry.svg"
import grape from "../assets/fruits/grapes.svg"
import lemon from "../assets/fruits/lemon.svg"
import orange from "../assets/fruits/orange.svg"
import strawberry from "../assets/fruits/strawberry.svg"
import watermelon from "../assets/fruits/watermelon.svg"
import tomato from "../assets/fruits/tomato.svg"
import kiwi from "../assets/fruits/kiwi.svg"


type ResultMenuProps = {
    start?: number;
    onResultTimeUp?: () => void;
    resultFruit?: string | null;
};

export default function ResultMenu({ start = 5, onResultTimeUp, resultFruit }: ResultMenuProps) {
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
            <motion.img
                src={shine}
                alt="Shine"
                className="absolute top-[57px] left-1/2 transform -translate-x-1/2"
                animate={{ rotate: 360, scale: [1, 1.1, 1] }}
                transition={{
                    rotate: { repeat: Infinity, duration: 6, ease: "linear" },
                    scale: { repeat: Infinity, duration: 2, ease: "easeInOut" },
                }}
            />
            {/* <img src={shine} alt="Shine" className="absolute top-[57px] left-1/2 transform -translate-x-1/2" /> */}
            {resultFruit === "Kiwi" && <img src={kiwi} alt="kiwi" className="absolute top-[70px] h-[85px] w-[85px] left-1/2 transform -translate-x-1/2" />}
            {resultFruit === "Orange" && <img src={orange} alt="orange" className="absolute top-[70px] h-[85px] w-[85px] left-1/2 transform -translate-x-1/2" />}
            {resultFruit === "Lemon" && <img src={lemon} alt="lemon" className="absolute top-[70px] h-[85px] w-[85px] left-1/2 transform -translate-x-1/2" />}
            {resultFruit === "Cherry" && <img src={cherry} alt="cherry" className="absolute top-[42px] h-[105px] w-[105px] left-1/2 transform -translate-x-1/2" />}
            {resultFruit === "Strawberry" && <img src={strawberry} alt="strawberry" className="absolute top-[70px] h-[85px] w-[85px] left-1/2 transform -translate-x-1/2" />}
            {resultFruit === "Grape" && <img src={grape} alt="grape" className="absolute top-[70px] h-[85px] w-[85px] left-1/2 transform -translate-x-1/2" />}
            {resultFruit === "Watermelon" && <img src={watermelon} alt="watermelon" className="absolute top-[70px] h-[85px] w-[85px] left-1/2 transform -translate-x-1/2" />}
            {resultFruit === "Tomato" && <img src={tomato} alt="tomato" className="absolute top-[70px] h-[85px] w-[85px] left-1/2 transform -translate-x-1/2" />}
        </div>
    )
}


