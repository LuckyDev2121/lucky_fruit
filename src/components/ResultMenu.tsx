import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import rectangle from "../assets/Modal/Rectangle.svg"

import linel from "../assets/Modal/LineL.svg"
import liner from "../assets/Modal/LineR.svg"
import abatar from "../assets/Modal/abatar.svg"
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";
// import cherry from "../assets/fruits/cherry.svg"
// import grape from "../assets/fruits/grapes.svg"
// import lemon from "../assets/fruits/lemon.svg"
// import orange from "../assets/fruits/orange.svg"
// import strawberry from "../assets/fruits/strawberry.svg"
// import watermelon from "../assets/fruits/watermelon.svg"
// import tomato from "../assets/fruits/tomato.svg"
// import kiwi from "../assets/fruits/kiwi.svg"
import { type GameElement, fetchGameElements } from '../api/gameElementApi';

type ResultMenuProps = {
    start?: number;
    onResultTimeUp?: () => void;
    resultFruit?: string | null;
};

export default function ResultMenu({ start = 5, onResultTimeUp, resultFruit }: ResultMenuProps) {
    const [gameElements, setGameElements] = useState<GameElement[]>([]);
    const [time, setTime] = useState(start);
    const [error, setError] = useState<string | null>(null);
    const onResultTimeUpRef = useRef(onResultTimeUp);
    const fruitMeta: Record<string, { id: number; alt: string; size: string; top: string }> = {
        A: { id: 27, alt: "kiwi", size: "h-[85px] w-[85px]", top: "top-[70px]" },
        B: { id: 28, alt: "orange", size: "h-[85px] w-[85px]", top: "top-[70px]" },
        C: { id: 29, alt: "lemon", size: "h-[85px] w-[85px]", top: "top-[70px]" },
        D: { id: 30, alt: "cherry", size: "h-[105px] w-[105px]", top: "top-[42px]" },
        E: { id: 31, alt: "strawberry", size: "h-[85px] w-[85px]", top: "top-[70px]" },
        F: { id: 32, alt: "grape", size: "h-[85px] w-[85px]", top: "top-[70px]" },
        G: { id: 33, alt: "watermelon", size: "h-[85px] w-[85px]", top: "top-[70px]" },
        H: { id: 26, alt: "tomato", size: "h-[85px] w-[85px]", top: "top-[70px]" },
    };

    const selectedElement = resultFruit
        ? gameElements.find((element) => element.id === fruitMeta[resultFruit].id)
        : null;
    const selectedFruit = resultFruit && selectedElement
        ? {
            src: selectedElement.element_icon,
            ...fruitMeta[resultFruit],
        }
        : null;

    useEffect(() => {
        const loadGameElements = async () => {
            try {
                const data = await fetchGameElements();
                setGameElements(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            }
        };
        loadGameElements();
    }, []);

    useEffect(() => {
        onResultTimeUpRef.current = onResultTimeUp;
    }, [onResultTimeUp, resultFruit]);

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
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <img src={rectangle} alt="Rectangle" className="absolute left-1/2 transform -translate-x-1/2" />
            <span className="absolute  left-1/2 transform -translate-x-1/2 text-sm font-bold mt-1">Round 178 of Today</span>
            <span className="absolute h-[19px] w-[19px] mt-[5px] right-[62px] rounded-full " >
                {formatted}
            </span>
            <div className="absolute left-1/2 top-[57px] h-[117px] w-[117px] -translate-x-1/2 overflow-hidden rounded-full">
                <motion.img
                    src={getAssetUrl(GAME_ASSETS.rotatedInstances)}
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
            <span className="absolute left-1/2 -translate-x-1/2 top-[191px]">Did not Participant in the round</span>
            <img src={linel} alt="Line" className="absolute left-[61px] top-[221px]" />
            <img src={liner} alt="Line" className="absolute left-[281px] top-[221px]" />
            <span className="absolute left-1/2 -translate-x-1/2 top-[215px] text-[#FFFFFF]/60">Biggest winning of the round</span>
            <div className="absolute grid grid-cols-3 top-[244px] w-[300px] h-[100px] left-1/2 -translate-x-1/2 ">
                <div className="relative h-[100px] w-[100px]">
                    <img src={abatar} alt="abatar" className="absolute w-[50px] h-[50px] left-1/2 -translate-x-1/2" />
                    <span className="absolute top-[50px] w-[100px] text-center">name</span>
                    <div className="absolute flex top-[70px] w-[100px] items-center justify-center">
                        <div className="relative ">
                            <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" className="h-[9px] w-[16px] mr-[3px]" />
                        </div>
                        <span >1000</span>
                    </div>
                </div>
                <div className="relative h-[100px] w-[100px]">
                    <img src={abatar} alt="abatar" className="absolute w-[50px] h-[50px] left-1/2 -translate-x-1/2" />
                    <span className="absolute top-[50px] w-[100px] text-center">name</span>
                    <div className="absolute flex top-[70px] w-[100px] items-center justify-center">
                        <div className="relative ">
                            <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" className="h-[9px] w-[16px] mr-[3px]" />
                        </div>
                        <span >1000</span>
                    </div>
                </div>
                <div className="relative h-[100px] w-[100px]">
                    <img src={abatar} alt="image" className="absolute w-[50px] h-[50px] left-1/2 -translate-x-1/2" />
                    <span className="absolute top-[50px] w-[100px] text-center">name</span>
                    <div className="absolute flex top-[70px] w-[100px] items-center justify-center">
                        <div className="relative ">
                            <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" className="h-[9px] w-[16px] mr-[3px]" />
                        </div>
                        <span >1000</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

