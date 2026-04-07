import { useEffect, useMemo, useState } from "react";
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";
import ChooseRectangle from "./ChooseRectangle";
import ChooseTimer from "./ChooseTimer";
import GameElements from "./GameElements";
import HiddenTimer from "./HiddenTimer";
import LedTimer from "./LedTimer";
import { useGame, resolveAssetUrl } from "../hooks/useGameHook";
import MovingHand from "./MoveHand";

type PlayBoardProps = {
    onOpenModal: (modal: string) => void;
    onOpenAlert: (alert: string) => void;
    RoundId: number | null;
    isRoundRunning: boolean;
    onRoundFinished: () => void;
};

export default function PlayBoard({
    onOpenModal,
    onOpenAlert,
    RoundId,
    isRoundRunning,
    onRoundFinished,
}: PlayBoardProps) {

    const [blockClick, setBlockClick] = useState<"auto" | "none">("none");
    const [showLedTimer, setShowLedTimer] = useState(false);
    const [showChooseTimer, setShowChooseTimer] = useState(false);
    const [showHiddenTimer, setShowHiddenTimer] = useState(false);
    const [showBoardOpacity, setShowBoardOpacity] = useState(false);
    const [showHand, setShowHand] = useState(false);
    const [showChooseRectangle, setShowChooseRectangle] = useState(false);
    const [currentBetAmount, setCurrentBetAmount] = useState(100);
    // const [bet, setBet] = useState(false)
    const [resetKey, setResetKey] = useState(0)
    const { betAmounts, options, results, clearCurrentRoundBets } = useGame();
    const optionMap = useMemo(() => {
        return Object.fromEntries(
            options.map(o => [o.id, o.logo])
        );
    }, [options]);
    const roundKey = RoundId ?? "waiting";

    const getResultOptionLogo = (id: number) =>
        optionMap[id] ? resolveAssetUrl(optionMap[id]) : "";

    useEffect(() => {
        if (!isRoundRunning || !RoundId) {
            setBlockClick("none");
            setShowLedTimer(false);
            setShowChooseTimer(false);
            setShowHiddenTimer(false);
            setShowBoardOpacity(false);
            setShowChooseRectangle(false);
            setShowHand(false);
            return;
        }

        setBlockClick("auto");
        setShowLedTimer(true);
        setShowChooseTimer(false);
        setShowHiddenTimer(false);
        setShowBoardOpacity(false);
        setShowChooseRectangle(false);
        setShowHand(true);
    }, [RoundId, isRoundRunning]);

    useEffect(() => {
        if (isRoundRunning && RoundId) {
            clearCurrentRoundBets();
        }
    }, [RoundId, isRoundRunning, clearCurrentRoundBets]);

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
                    {RoundId ? (`Round ${RoundId} of today`) : (`Please wait next round`)}
                </span>
                <img
                    src={getAssetUrl(GAME_ASSETS.fruitContainerFrame)}
                    className="absolute left-1/2 top-[90px] z-20 -translate-x-1/2 transform"
                />
                {showHand && (
                    <MovingHand />
                )}
                <GameElements removeBet={resetKey} controlButtons={blockClick} currentBetAmount={currentBetAmount} />
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
                    className="absolute left-[calc(78%-0px)] top-[324px] z-20 h-fit"
                >
                    <div className="relative ml-[20px] flex h-[30px] w-[80px] items-center justify-center overflow-hidden rounded-[15px] border border-[#b889d0] bg-gradient-to-b from-[#7f4a93] via-[#5f2e72] to-[#3b163f] shadow-[inset_0_1px_0_rgba(255,255,255,0.55),inset_0_-2px_0_rgba(46,13,55,0.8)]">
                        <div className="absolute left-[2px] top-[2px] h-[11px] w-[76px] rounded-[12px] bg-gradient-to-b from-[#dbc5e7] via-[#a66bb8] to-transparent opacity-80"></div>
                        <div className="absolute inset-x-[3px] bottom-[3px] h-[12px] rounded-[10px] bg-[#43204c] opacity-90"></div>
                        <div className="absolute inset-[1px] rounded-[14px] border border-white/15"></div>
                        <span className="relative text-[16px] font-medium leading-none text-white [text-shadow:0_1px_2px_rgba(46,13,55,0.9)]">Repeat</span>
                    </div>
                </button>
                <div
                    className="absolute inset-0 top-[361px] pt-[10px] z-20 flex justify-center"
                    style={{ pointerEvents: "auto" }}
                >
                    {betAmounts.map((element, index) => {
                        const amountValue = Number.parseInt(element.amount, 10);

                        return (
                            <button
                                key={element.id}
                                className="relative"
                                onClick={() => setCurrentBetAmount(amountValue)}
                            >
                                <img
                                    src={resolveAssetUrl(element.icon)}
                                    alt={`Bet amount ${element.amount}`}
                                    className="relative pt-0"
                                />
                                {currentBetAmount === 100 && index === 0 && (
                                    <div className="absolute left-[1px] top-[0px] h-[41px] w-[54px] bg-[#ffae00]/50 rounded-full"></div>
                                )}
                                {currentBetAmount === 1000 && index === 1 && (
                                    <div className="absolute left-[5px] top-[0px] h-[41px] w-[54px] bg-[#ffae00]/50 rounded-full"></div>
                                )}
                                {currentBetAmount === 10000 && index === 2 && (
                                    <div className="absolute left-[6px] top-[1px] h-[42px] w-[52px] bg-[#ffae00]/50 rounded-full"></div>
                                )}
                                {currentBetAmount === 100000 && index === 3 && (
                                    <div className="absolute left-[6px] top-[1px] h-[41px] w-[53px] bg-[#ffae00]/50 rounded-full"></div>
                                )}
                                {currentBetAmount === 1000000 && index === 4 && (
                                    <div className="absolute left-[2px] top-[0px] h-[42px] w-[53px] bg-[#ffae00]/50 rounded-full"></div>
                                )}
                            </button>
                        )
                    })}
                </div>
                <img
                    src={getAssetUrl(GAME_ASSETS.resultboardbg)}
                    className="absolute left-1/2 top-[442px] z-20 -translate-x-1/2 transform"
                />

                <div className="scrollbar-hidden absolute flex left-1/2 top-[442px] h-[40px] w-[280px] overflow-y-hidden overflow-x-auto z-20 -translate-x-1/2 transform">
                    <div className="flex items-center h-full whitespace-nowrap ">
                        {results?.data?.map((result, index) => (
                            <div key={index} className=" flex-shrink-0 relative h-[30px] w-[30px] mt-[3px] mr-[12px]">
                                <img
                                    src={getResultOptionLogo(result.option_id)}
                                    alt={result.option_name || `Result ${index + 1}`}
                                    className="absolute inset-0 h-full w-full"
                                />
                                {index === 0 && (
                                    <div className="absolute left-[3px] top-[18px] w-[24px] h-[12px] z-50">
                                        <img src={getAssetUrl(GAME_ASSETS.newtag)} alt="Result Board Frame" className="absolute inset-0 h-full w-full" />
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {showBoardOpacity && (
                    <div className="absolute w-[280px] h-[271px]  rounded-[12px] border-[1px] border-[#FFB24C] left-1/2 top-[90px] z-30 bg-[#360149] -translate-x-1/2 transform opacity-40"></div>
                )}
                {showLedTimer && (
                    <div className="absolute  left-[calc(50%+1px)] top-[198px] z-50 -translate-x-1/2 transform">
                        <LedTimer
                            key={`led-${roundKey}`}
                            start={30}
                            onLedTimeUp={() => {
                                setShowChooseTimer(true);
                                setShowLedTimer(false);
                                setShowBoardOpacity(true);
                                setBlockClick("none");
                                setShowChooseRectangle(true);
                                setShowHand(false);
                            }}
                        />
                    </div>
                )}
                {showChooseTimer && (
                    <div className="absolute left-[calc(50%+1px)] top-[198px] z-50 -translate-x-1/2 transform">
                        <ChooseTimer
                            key={`choose-${roundKey}`}
                            start={4}
                            onChooseTimeUp={() => {
                                setShowChooseRectangle(false);
                                setShowChooseTimer(false);
                                setShowHiddenTimer(true);
                                onOpenModal("result");
                                setResetKey(prev => prev + 1);
                            }}
                        />
                    </div>
                )}
                {showHiddenTimer && (
                    <div className="absolute left-1/2 top-[197px] z-30 -translate-x-1/2 transform">
                        <HiddenTimer
                            key={`hidden-${roundKey}`}
                            start={2}
                            onHiddenTimeUp={() => {
                                setShowHiddenTimer(false);
                                setShowBoardOpacity(false);
                                setShowHand(false);
                                setBlockClick("none");
                                onRoundFinished();
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
