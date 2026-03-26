import rectangle from "../assets/PlayBoard/chooserectangle.svg"
import { useEffect, useRef, useState } from "react"
// import { type GameElement, fetchGameElements } from '../api/gameElementApi';

const fruits = [
    { id: 0, element_name: "G", top: 94, left: 154 },
    { id: 1, element_name: "F", top: 94, left: 248 },
    { id: 2, element_name: "E", top: 183, left: 248 },
    { id: 3, element_name: "D", top: 273, left: 248 },
    { id: 4, element_name: "C", top: 273, left: 154 },
    { id: 5, element_name: "B", top: 273, left: 60 },
    { id: 6, element_name: "A", top: 183, left: 60 },
    { id: 7, element_name: "H", top: 94, left: 60 }
];


export default function ChooseRectangle({ onChooseTimeUp, onResult }: { onChooseTimeUp?: () => void; onResult?: (fruit: string) => void }) {
    const [time, setTime] = useState(0);
    const [second, setSecond] = useState(10000);
    const [randomIndex] = useState(() => Math.floor(Math.random() * fruits.length));
    const onChooseTimeUpRef = useRef(onChooseTimeUp);
    const onResultRef = useRef(onResult);
    const currentFruit = fruits[(randomIndex + time - 1) % fruits.length];
    // const [gameElements, setGameElements] = useState<GameElement[]>([]);

    // useEffect(() => {
    //     const loadGameElements = async () => {
    //         const data = await fetchGameElements();
    //         setGameElements(data);
    //     };
    //     loadGameElements();
    // }, []);

    useEffect(() => {
        onChooseTimeUpRef.current = onChooseTimeUp;
    }, [onChooseTimeUp]);

    useEffect(() => {
        onResultRef.current = onResult;
    }, [onResult]);

    useEffect(() => {

        if (second - 10 * time < 100) {
            onResultRef.current?.(currentFruit.element_name);
            onChooseTimeUpRef.current?.(); // trigger notification
            return;
        }

        const timer = setInterval(() => {
            setSecond((s) => s - 100 - 10 * time);
            setTime((t) => t + 1);
        }, 100 + 10 * time);

        return () => {
            clearInterval(timer)
        };
    }, [time, second, currentFruit.element_name]);

    return (
        <div className="absolute z-40" style={{ top: `${fruits[(randomIndex + time) % fruits.length].top}px`, left: `${fruits[(randomIndex + time) % fruits.length].left}px` }}>
            <img src={rectangle} alt="Choose Rectangle" className="relative" />
        </div>
    );
}
