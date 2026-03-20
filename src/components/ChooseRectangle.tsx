import rectangle from "../assets/PlayBoard/chooserectangle.svg"
import { useEffect, useRef, useState } from "react"

const fruits = [
    { id: 0, element_name: "Kiwi", top: 94, left: 154 },
    { id: 1, element_name: "Orange", top: 94, left: 248 },
    { id: 2, element_name: "Lemon", top: 183, left: 248 },
    { id: 3, element_name: "Cherry", top: 273, left: 248 },
    { id: 4, element_name: "Strawberry", top: 273, left: 154 },
    { id: 5, element_name: "Grape", top: 273, left: 60 },
    { id: 6, element_name: "Watermelon", top: 183, left: 60 },
    { id: 7, element_name: "Tomato", top: 94, left: 60 }
];


export default function ChooseRectangle({ onChooseTimeUp, onResult }: { onChooseTimeUp?: () => void; onResult?: (fruit: string) => void }) {
    const [time, setTime] = useState(0);
    const [second, setSecond] = useState(10000);
    const [randomIndex] = useState(() => Math.floor(Math.random() * fruits.length));
    const onChooseTimeUpRef = useRef(onChooseTimeUp);
    const onResultRef = useRef(onResult);
    const currentFruit = fruits[(randomIndex + time - 1) % fruits.length];

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
