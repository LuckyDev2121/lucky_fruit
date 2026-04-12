import { useEffect, useRef, useState } from "react"
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";
import { useGame } from "../hooks/useGameHook";
import type { ResultData } from "../api/api";
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

export default function ChooseRectangle({ onChooseTimeUp, RoundId }: { onChooseTimeUp?: () => void; RoundId?: number | null; onResult?: (fruit: string) => void }) {
    const [time, setTime] = useState(0);
    const [second, setSecond] = useState(0);
    const [timestep, setTimestep] = useState(100);
    const [resultResponse, setResultResponse] = useState<ResultData | null>(null);
    const onChooseTimeUpRef = useRef(onChooseTimeUp);
    const currentFruit = fruits[(8 + time) % fruits.length];
    const { makeGameRound, makeResult } = useGame();
    const [steps, setSteps] = useState(0);
    const result = resultResponse ?? makeResult;


    useEffect(() => {
        onChooseTimeUpRef.current = onChooseTimeUp;
    }, [onChooseTimeUp]);

    useEffect(() => {
        if (second >= 4820) {
            onChooseTimeUpRef.current?.(); // trigger notification
            return;
        }
        const timer = setInterval(() => {
            if (second <= 4000) {
                setSecond((s) => s + 100);
                setTime((t) => t + 1);
                setTimestep(100);
                if (second === 2000) {
                    if (RoundId) {
                        void makeGameRound(RoundId)
                            .then((response) => {
                                setResultResponse(response);
                            })
                            .catch((error) => {
                                console.error(error);
                            });
                    }
                }
                if (second === 4000) {
                    setSteps(((result?.winning_option_id ? result.winning_option_id : 0) - currentFruit.id + 8) % fruits.length);
                }
            }

            if (second > 4000 && second < 4820) {
                if (steps === 0) {
                    setSecond((s) => s + 100);
                    setTime((t) => t + 1);
                    setTimestep(100);
                }
                if (steps === 1) {
                    setSecond((s) => s + 800);
                    setTime((t) => t + 1);
                    setTimestep(900);
                }
                if (steps === 2) {
                    setSecond((s) => s + 400);
                    setTime((t) => t + 1);
                    setTimestep(400);
                }
                if (steps === 3) {
                    setSecond((s) => s + 300);
                    setTime((t) => t + 1);
                    setTimestep(300);
                }
                if (steps === 4) {
                    setSecond((s) => s + 200);
                    setTime((t) => t + 1);
                    setTimestep(200);
                }
                if (steps === 5) {
                    if (second > 4200) {
                        setSecond((s) => s + 200);
                        setTime((t) => t + 1);
                        setTimestep(200);
                    } else {
                        setSecond((s) => s + 100);
                        setTime((t) => t + 1);
                        setTimestep(100);
                    }
                }
                if (steps === 6) {
                    if (second > 4300) {
                        setSecond((s) => s + 200);
                        setTime((t) => t + 1);
                        setTimestep(200);
                    } else {
                        setSecond((s) => s + 100);
                        setTime((t) => t + 1);
                        setTimestep(100);
                    }
                }
                if (steps === 7) {
                    if (second > 4600) {
                        setSecond((s) => s + 200);
                        setTime((t) => t + 1);
                        setTimestep(200);
                    } else {
                        setSecond((s) => s + 100);
                        setTime((t) => t + 1);
                        setTimestep(100);
                    }
                }
            }
        }, timestep);
        return () => {
            clearInterval(timer)
        };
    }, [second, time,]);
    return (
        <div className="absolute z-40" style={{ top: `${fruits[(8 + time) % fruits.length].top}px`, left: `${fruits[(8 + time) % fruits.length].left}px` }}>
            <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="relative" />
        </div>
    );
}
