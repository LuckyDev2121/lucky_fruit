import { useState } from "react";
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";

import repeat from "../assets/PlayBoard/repeat.svg";
import ChooseRectangle from "./ChooseRectangle";
import ChooseTimer from "./ChooseTimer";
import GameElements from "./GameElements";
import HiddenTimer from "./HiddenTimer";
import LedTimer from "./LedTimer";
import { useGameDetails, resolveAssetUrl } from '../hooks/useGameDetails';
import { useGameResults } from "../hooks/useGameResults";

type PlayBoardProps = {
    onOpenModal: (modal: string) => void;
    onOpenAlert: (alert: string) => void;
};

export default function PlayBoard({
    onOpenModal,
    onOpenAlert,
}: PlayBoardProps) {


    const [selectBetMode, setSelectBetMode] = useState(2);
    const [blockClick, setBlockClick] = useState<"auto" | "none">("auto");
    const [showLedTimer, setShowLedTimer] = useState(true);
    const [showChooseTimer, setShowChooseTimer] = useState(false);
    const [showHiddenTimer, setShowHiddenTimer] = useState(false);
    const [showBoardOpacity, setShowBoardOpacity] = useState(false);
    const [showChooseRectangle, setShowChooseRectangle] = useState(false);

    const { betAmounts, options } = useGameDetails();
    const { results } = useGameResults();

    const getResultOptionLogo = (optionId: number) => {
        const matchedOption = options.find((element) => element.id === optionId);
        return matchedOption?.logo ? resolveAssetUrl(matchedOption.logo) : "";
    };

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
                    className="absolute inset-0 top-[361px] pt-[10px] z-20 flex justify-center"
                    style={{ pointerEvents: "auto" }}
                >
                    {betAmounts.map((element, index) => {
                        return (
                            <button
                                key={element.id}
                                className="relative"
                                onClick={() => setSelectBetMode(index + 1)}
                            >
                                <img
                                    src={resolveAssetUrl(element.icon)}
                                    alt={`Bet amount ${element.amount}`}
                                    className={`relative ${selectBetMode === index + 1 ? "pt-0" : "pt-0"}`}
                                />
                            </button>
                        )
                    })}
                </div>
                <img
                    src={getAssetUrl(GAME_ASSETS.resultboardbg)}
                    className="absolute left-1/2 top-[442px] z-20 -translate-x-1/2 transform"
                />
                <div className="scrollbar-hidden absolute left-1/2 top-[442px] h-[40px] w-[280px] overflow-y-hidden overflow-x-auto z-20 -translate-x-1/2 transform">
                    <div className="absolute left-[3px] top-[26px] w-[24px] h-[12px] z-50">
                        <img src={getAssetUrl(GAME_ASSETS.newtag)} alt="Result Board Frame" className="absolute inset-0 h-full w-full" />
                    </div>
                    {results.map((result, index) => (
                        <div key={index} className="relative flex top-[4px] h-[30px] w-[30px] z-40">
                            <img
                                src={getResultOptionLogo(result.option_id)}
                                alt={result.option_name || `Result ${index + 1}`}
                                className="absolute inset-0 h-full w-full"
                            />
                        </div>
                    ))}
                </div>
                {showBoardOpacity && (
                    <div className="absolute w-[280px] h-[271px]  rounded-[12px] border-[1px] border-[#FFB24C] left-1/2 top-[90px] z-30 bg-[#360149] -translate-x-1/2 transform opacity-70"></div>
                )}
                {showLedTimer && (
                    <div className="absolute  left-[calc(50%+1px)] top-[198px] z-50 -translate-x-1/2 transform">
                        <LedTimer
                            start={30}
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
                            start={5}
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
                            start={3}
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
                    />
                )}
            </div>
        </div>
    );
}
