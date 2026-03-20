import { useEffect, useRef, useState } from "react";
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
    const onResultTimeUpRef = useRef(onResultTimeUp);

    const fruitConfig: Record<string, { src: string; alt: string; size: string; top: string }> = {
        Kiwi: { src: kiwi, alt: "kiwi", size: "h-[85px] w-[85px]", top: "top-[70px]" },
        Orange: { src: orange, alt: "orange", size: "h-[85px] w-[85px]", top: "top-[70px]" },
        Lemon: { src: lemon, alt: "lemon", size: "h-[85px] w-[85px]", top: "top-[70px]" },
        Cherry: { src: cherry, alt: "cherry", size: "h-[105px] w-[105px]", top: "top-[42px]" },
        Strawberry: { src: strawberry, alt: "strawberry", size: "h-[85px] w-[85px]", top: "top-[70px]" },
        Grape: { src: grape, alt: "grape", size: "h-[85px] w-[85px]", top: "top-[70px]" },
        Watermelon: { src: watermelon, alt: "watermelon", size: "h-[85px] w-[85px]", top: "top-[70px]" },
        Tomato: { src: tomato, alt: "tomato", size: "h-[85px] w-[85px]", top: "top-[70px]" },
    };

    const selectedFruit = resultFruit ? fruitConfig[resultFruit] : null;

    useEffect(() => {
        onResultTimeUpRef.current = onResultTimeUp;
    }, [onResultTimeUp]);

    useEffect(() => {
        setTime(start);
    }, [start]);

    useEffect(() => {
        const timer = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    onResultTimeUpRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, [start]);

    const formatted = time.toString().padStart(2, "0");

    return (
        <div className="relative h-[342px] w-[393px] overflow-hidden rounded-t-[20px] bg-gradient-to-t from-[#7C00D5] to-[#5028C1]">
            <img src={rectangle} alt="Rectangle" className="absolute left-1/2 transform -translate-x-1/2" />
            <span className="absolute  left-1/2 transform -translate-x-1/2 text-sm font-bold mt-1">Round 178 of Today</span>
            <span className="absolute h-[19px] w-[19px] mt-[5px] right-[62px] rounded-full " >
                {formatted}
            </span>
            <div className="absolute left-1/2 top-[57px] h-[117px] w-[117px] -translate-x-1/2 overflow-hidden rounded-full">
                <motion.img
                    src={shine}
                    alt="Shine"
                    className="absolute inset-0 h-full w-full origin-center opacity-50"
                    animate={{ rotate: 360 }}
                    transition={{
                        rotate: { repeat: Infinity, duration: 8, ease: "linear" },
                    }}
                />
            </div>
            {selectedFruit && (
                <img
                    src={selectedFruit.src}
                    alt={selectedFruit.alt}
                    className={`absolute left-1/2 -translate-x-1/2 ${selectedFruit.top} ${selectedFruit.size}`}
                />
            )}
        </div>
    )
}

