import { useEffect, useRef, useState } from "react"
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";
import { useGame } from "../hooks/useGameHook";

const fruits = [
    { id: 5, element_name: "H", top: 94, left: 60 },
    { id: 6, element_name: "G", top: 94, left: 154 },
    { id: 7, element_name: "F", top: 94, left: 248 },
    { id: 8, element_name: "E", top: 183, left: 248 },
    { id: 9, element_name: "D", top: 273, left: 248 },
    { id: 10, element_name: "C", top: 273, left: 154 },
    { id: 11, element_name: "B", top: 273, left: 60 },
    { id: 12, element_name: "A", top: 183, left: 60 },
];


export default function ChooseRectangle({ onChooseTimeUp }: { onChooseTimeUp?: () => void; onResult?: (fruit: string) => void }) {
    const [time, setTime] = useState(0);
    const [second, setSecond] = useState(0);
    const [add, setAdd] = useState(0);
    const [randomIndex] = useState(() => Math.floor(Math.random() * fruits.length));
    const onChooseTimeUpRef = useRef(onChooseTimeUp);
    const currentFruit = fruits[(randomIndex + time) % fruits.length];
    const { makeGameResult, makeResult } = useGame();
    const [steps, setSteps] = useState(0);
    useEffect(() => {
        onChooseTimeUpRef.current = onChooseTimeUp;
    }, [onChooseTimeUp]);

    useEffect(() => {

        if (second >= 4820) {
            onChooseTimeUpRef.current?.(); // trigger notification
            return;
        }

        const timer = setInterval(() => {
            if (second <= 2000) {
                setSecond((s) => s + 100);
                setTime((t) => t + 1);
            }
            if (second === 2000) {
                makeGameResult();
                setSteps(((makeResult?.winning_option_id ? makeResult.winning_option_id : 0) + 3 - currentFruit.id) % fruits.length);
            }
            if (second >= 3820 && second < 4820) {
                setSecond((s) => s + 100);
                setTime((t) => t);
            }
            if (second > 2000 && second < 3820) {
                if (second === 2100) { console.log("steps", makeResult?.winning_option_id, "====", steps, "====", currentFruit.id); }
                if (steps === 0) {
                    if (second > 2200) {
                        setSecond((s) => s + 100 + 100 * add);
                        setTime((t) => t + 1);
                        setAdd((a) => a + 1);
                    } else {
                        setSecond((s) => s + 100);
                        setTime((t) => t + 1);
                    }
                }
                if (steps === 1) {
                    if (second > 2300) {
                        setSecond((s) => s + 100 + 90 * add);
                        setTime((t) => t + 1);
                        setAdd((a) => a + 1);
                    } else {
                        setSecond((s) => s + 100);
                        setTime((t) => t + 1);
                    }
                }
                if (steps === 2) {
                    if (second > 2400) {
                        setSecond((s) => s + 100 + 80 * add);
                        setTime((t) => t + 1);
                        setAdd((a) => a + 1);
                    } else {
                        setSecond((s) => s + 100);
                        setTime((t) => t + 1);
                    }
                }
                if (steps === 3) {
                    if (second > 2300) {
                        setSecond((s) => s + 200);
                        setTime((t) => t + 1);
                        setAdd((a) => a + 1);
                    } else {
                        setSecond((s) => s + 100);
                        setTime((t) => t + 1);
                    }
                }
                if (steps === 4) {
                    if (second > 2600) {
                        setSecond((s) => s + 200);
                        setTime((t) => t + 1);
                        setAdd((a) => a + 1);
                    } else {
                        setSecond((s) => s + 100);
                        setTime((t) => t + 1);
                    }
                }
                if (steps === 5) {
                    if (second > 2700) {
                        setSecond((s) => s + 200);
                        setTime((t) => t + 1);
                        setAdd((a) => a + 1);
                    } else {
                        setSecond((s) => s + 100);
                        setTime((t) => t + 1);
                    }
                }
                if (steps === 6) {
                    if (second > 2900) {
                        setSecond((s) => s + 400);
                        setTime((t) => t + 1);
                        setAdd((a) => a + 1);
                    } else {
                        setSecond((s) => s + 300);
                        setTime((t) => t + 1);
                    }
                }
                if (steps === 7) {
                    setSecond((s) => s + 100 + 100 * add);
                    setTime((t) => t + 1);
                    setAdd((a) => a + 1);
                }
            }
        }, 100);

        return () => {
            clearInterval(timer)
        };
    }, [time, second]);

    return (
        <div className="absolute z-40" style={{ top: `${fruits[(randomIndex + time) % fruits.length].top}px`, left: `${fruits[(randomIndex + time) % fruits.length].left}px` }}>
            <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="relative" />
        </div>
    );
}
