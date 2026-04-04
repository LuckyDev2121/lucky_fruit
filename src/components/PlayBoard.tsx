import { useState } from "react";
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";
import bottomboard from "../assets/BottomBoard/bottomboard.svg";
import opacityBoard from "../assets/PlayBoard/playboardopacity.svg";
import repeat from "../assets/PlayBoard/repeat.svg";
import ChooseRectangle from "./ChooseRectangle";
import ChooseTimer from "./ChooseTimer";
import GameElements from "./GameElements";
import HiddenTimer from "./HiddenTimer";
import LedTimer from "./LedTimer";

type PlayBoardProps = {
    onOpenModal: (modal: string) => void;
    onOpenAlert: (alert: string) => void;
    onResult: (fruit: string) => void;
};

export default function PlayBoard({
    onOpenModal,
    onOpenAlert,
    onResult,
}: PlayBoardProps) {
    const [selectBetMode, setSelectBetMode] = useState(2);
    const [blockClick, setBlockClick] = useState<"auto" | "none">("auto");
    const [showLedTimer, setShowLedTimer] = useState(true);
    const [showChooseTimer, setShowChooseTimer] = useState(false);
    const [showHiddenTimer, setShowHiddenTimer] = useState(false);
    const [showBoardOpacity, setShowBoardOpacity] = useState(false);
    const [showChooseRectangle, setShowChooseRectangle] = useState(false);

    return (
        <div className="absolute z-20 object-contain" style={{ width: "100%", height: "100%" }}>
            <div className="relative inset-0 z-20">
                <img
                    src={getAssetUrl(GAME_ASSETS.fruitGameName)}
                    alt="luckyfruit"
                    className="absolute inset-0 left-1/2 top-[25px] z-20 -translate-x-1/2 transform"
                />
                <img src={getAssetUrl(GAME_ASSETS.fruitBgFrame)} className="absolute inset-0 mt-[7px]" />
                <span className="absolute left-1/2 top-[70px] h-[18px] w-[124px] -translate-x-1/2 transform justify-center rounded-full bg-[#3D005C] text-center font-regular">
                    Round 1526 of today
                </span>
                <img
                    src={getAssetUrl(GAME_ASSETS.fruitContainerFrame)}
                    className="absolute left-1/2 top-[90px] z-20 -translate-x-1/2 transform"
                />
                <GameElements controlButtons={blockClick} />
                <img
                    src={getAssetUrl(GAME_ASSETS.timeCountingBoard)}
                    className="absolute left-[calc(50%-1px)] top-[183px] z-40 -translate-x-1/2 transform"
                />
                <button
                    style={{
                        cursor: "pointer",
                        pointerEvents: "auto",
                    }}
                    onClick={() => onOpenAlert("repeat")}
                    className="absolute left-[calc(78%-0px)] top-[320px] z-20 h-fit w-full"
                >
                    <img src={repeat} alt="Repeat Icon" className="relative" />
                </button>
                <div
                    className="absolute inset-0 top-[361px] z-20 flex justify-center"
                    style={{ pointerEvents: "auto" }}
                >
                    <button className="relative" onClick={() => setSelectBetMode(1)}>
                        <img
                            src={getAssetUrl(GAME_ASSETS.betAmount100)}
                            alt="Level 1"
                            className={`relative ${selectBetMode === 1 ? "pt-3" : "pt-0"}`}
                        />
                    </button>
                    <button className="relative" onClick={() => setSelectBetMode(2)}>
                        <img
                            src={getAssetUrl(GAME_ASSETS.betAmount1000)}
                            alt="Level 2"
                            className={`relative ${selectBetMode === 2 ? "pt-3" : "pt-0"}`}
                        />
                    </button>
                    <button className="relative" onClick={() => setSelectBetMode(3)}>
                        <img
                            src={getAssetUrl(GAME_ASSETS.betAmount10k)}
                            alt="Level 3"
                            className={`relative ${selectBetMode === 3 ? "pt-3" : "pt-0"}`}
                        />
                    </button>
                    <button className="relative" onClick={() => setSelectBetMode(4)}>
                        <img
                            src={getAssetUrl(GAME_ASSETS.betAmount100k)}
                            alt="Level 4"
                            className={`relative ${selectBetMode === 4 ? "pt-3" : "pt-0"}`}
                        />
                    </button>
                    <button className="relative" onClick={() => setSelectBetMode(5)}>
                        <img
                            src={getAssetUrl(GAME_ASSETS.betAmount1M)}
                            alt="Level 5"
                            className={`relative ${selectBetMode === 5 ? "pt-3" : "pt-0"}`}
                        />
                    </button>
                </div>
                <img
                    src={bottomboard}
                    className="absolute left-1/2 top-[442px] z-20 -translate-x-1/2 transform"
                />
                {showBoardOpacity && (
                    <img
                        src={opacityBoard}
                        className="absolute left-1/2 top-[90px] z-30 -translate-x-1/2 transform opacity-70"
                    />
                )}
                {showLedTimer && (
                    <div className="absolute left-[calc(50%+1px)] top-[198px] z-50 -translate-x-1/2 transform">
                        <LedTimer
                            start={10}
                            onLedTimeUp={() => {
                                setShowChooseTimer(true);
                                setShowLedTimer(false);
                                setShowBoardOpacity(true);
                                setBlockClick("none");
                                setShowChooseRectangle(true);
                            }}
                        />
                    </div>
                )}
                {showChooseTimer && (
                    <div className="absolute left-[calc(50%+1px)] top-[198px] z-50 -translate-x-1/2 transform">
                        <ChooseTimer
                            start={10}
                            onChooseTimeUp={() => {
                                setShowChooseTimer(false);
                                setShowHiddenTimer(true);
                                onOpenModal("result");
                            }}
                        />
                    </div>
                )}
                {showHiddenTimer && (
                    <div className="absolute left-1/2 top-[197px] z-30 -translate-x-1/2 transform">
                        <HiddenTimer
                            start={5}
                            onHiddenTimeUp={() => {
                                setShowHiddenTimer(false);
                                setShowLedTimer(true);
                                setBlockClick("auto");
                                setShowBoardOpacity(false);
                            }}
                        />
                    </div>
                )}
                {showChooseRectangle && (
                    <ChooseRectangle
                        onChooseTimeUp={() => {
                            setShowChooseRectangle(false);
                        }}
                        onResult={(fruit) => {
                            onResult(fruit);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
