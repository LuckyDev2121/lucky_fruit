import playboard from "../assets/PlayBoard/playboard.svg";
import fruitboard from "../assets/PlayBoard/fruitboard.svg";
import luckyfruit from "../assets/PlayBoard/luckyfruit.svg";
import timer from "../assets/PlayBoard/timer.svg";
import repeat from "../assets/PlayBoard/repeat.svg";
import lvl1 from "../assets/BetBoard/100.svg"
import lvl2 from "../assets/BetBoard/1000.svg"
import lvl3 from "../assets/BetBoard/1000.svg"
import lvl4 from "../assets/BetBoard/100K.svg"
import lvl5 from "../assets/BetBoard/1M.svg"
import bottomboard from "../assets/BottomBoard/bottomboard.svg"
import opacityBoard from "../assets/PlayBoard/playboardopacity.svg"
import ChooseRectangle from "./ChooseRectangle";
import FruitBoard from "./FruitBoard";
// import GameElements from "./GameElements";
import LedTimer from "./LedTimer";
import ChooseTimer from "./ChooseTimer";
import HiddenTimer from "./HiddenTimer";
import { useState } from "react";

type PlayBoardProps = {
    onOpenModal: (modal: string) => void;
    onOpenAlert: (alert: string) => void;
    onResult: (fruit: string) => void; // 👈 NEW PROP
};

export default function PlayBoard({ onOpenModal, onOpenAlert, onResult }: PlayBoardProps) {

    const [resultFruit, setResultFruit] = useState<string | null>(null);
    const [blockClick, setBlockClick] = useState<"auto" | "none">("auto");
    const [showLedTimer, setShowLedTimer] = useState(true);
    const [showChooseTimer, setShowChooseTimer] = useState(false);
    const [showHiddenTimer, setShowHiddenTimer] = useState(false);
    const [showBoardOpacity, setShowBoardOpacity] = useState(false);
    const [showChooseRectangle, setShowChooseRectangle] = useState(false);
    return (
        <div className="pointer-events-none absolute z-20 object-contain" style={{ width: "100%", height: "100%" }}>
            <div className=" relative z-20 inset-0">
                <img src={luckyfruit} alt="luckyfruit" className="absolute top-[25px] inset-0 z-20 left-1/2 transform -translate-x-1/2" />
                <img src={playboard} className=" absolute inset-0 mt-[7px]" />
                <span className="absolute justify-center font-regular top-[70px] w-[124px] h-[18px] text-center left-1/2 transform -translate-x-1/2 rounded-full bg-[#3D005C] ">Round 1526 of today</span>
                <img src={fruitboard} className=" absolute top-[90px] z-20 left-1/2 transform -translate-x-1/2" />
                <FruitBoard controlButtons={blockClick} />
                <img src={timer} className="absolute top-[183px] z-40 left-[calc(50%-1px)] transform -translate-x-1/2" />
                <button
                    style={{
                        cursor: "pointer",
                        pointerEvents: 'auto'
                    }}
                    onClick={() => onOpenAlert("repeat")}
                    className="absolute top-[320px] h-fit w-full z-20 left-[calc(78%-0px)]">
                    <img src={repeat} alt="Repeat Icon" className="relative" />
                </button>
                <div className="absolute inset-0 top-[361px] z-20 flex justify-center" style={{ pointerEvents: 'auto' }}>
                    <button className="relative" onClick={() => console.log("Level 1 clicked")}>
                        <img src={lvl1} alt="Level 1" className="relative" />
                    </button>
                    <button className="relative" onClick={() => console.log("Level 2 clicked")}>
                        <img src={lvl2} alt="Level 2" className="relative" />
                    </button>
                    <button className="relative" onClick={() => console.log("Level 3 clicked")}>
                        <img src={lvl3} alt="Level 3" className="relative" />
                    </button>
                    <button className="relative" onClick={() => console.log("Level 4 clicked")}>
                        <img src={lvl4} alt="Level 4" className="relative" />
                    </button>
                    <button className="relative" onClick={() => console.log("Level 5 clicked")}>
                        <img src={lvl5} alt="Level 5" className="relative" />
                    </button>

                </div>
                <img src={bottomboard} className=" absolute top-[442px] left-1/2 transform -translate-x-1/2 z-20" />
                {showBoardOpacity && (
                    <img src={opacityBoard} className=" absolute opacity-70 top-[90px] left-1/2 transform -translate-x-1/2 z-30" />
                )}
                {showLedTimer && (
                    <div className="absolute z-50 top-[198px] left-1/2 transform -translate-x-1/2">
                        <LedTimer start={40} onLedTimeUp={() => {
                            setShowChooseTimer(true)
                            setShowLedTimer(false)
                            setShowBoardOpacity(true)
                            setBlockClick("none")
                            setShowChooseRectangle(true)
                        }} />
                    </div>
                )}
                {showChooseTimer && (
                    <div className="absolute z-50 top-[198px] left-1/2 transform -translate-x-1/2">
                        <ChooseTimer start={10} onChooseTimeUp={() => {
                            setShowChooseTimer(false)
                            setShowHiddenTimer(true)
                            onOpenModal("result")
                        }} />
                    </div>
                )}
                {showHiddenTimer && (
                    <div className="absolute z-30 top-[197px] left-1/2 transform -translate-x-1/2">
                        <HiddenTimer start={5} onHiddenTimeUp={() => {
                            setShowHiddenTimer(false)
                            setShowLedTimer(true)
                            setBlockClick("auto")
                            setShowBoardOpacity(false)
                        }} />
                    </div>
                )}
                {showChooseRectangle && (
                    <ChooseRectangle onChooseTimeUp={() => {
                        setShowChooseRectangle(false)
                    }}
                        onResult={(fruit) => {
                            setResultFruit(fruit);   // store locally
                            onResult(fruit)// send up to LuckyFruitGame 🚀
                        }}
                    />
                )}
            </div>
        </div >
    )
}