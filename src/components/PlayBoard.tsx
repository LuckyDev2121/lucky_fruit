import { useEffect, useMemo, useRef, useState } from "react";
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";
import ChooseRectangle from "./ChooseRectangle";
import ChooseTimer from "./ChooseTimer";
import ResultTimer from "./ResultTimer"
import GameElements from "./GameElements";
import HiddenTimer from "./HiddenTimer";
import LedTimer from "./LedTimer";
import { useGame, resolveAssetUrl } from "../hooks/useGameHook";
import MovingHand from "./MoveHand";

type PlayBoardProps = {
    onOpenModal: (modal: string) => void;
    onRepeatButtonClick: () => void;
    RoundId: number | null;
    isRoundRunning: boolean;
    onRoundFinished: () => void;
    repeatRequestId: number;
    RoundTime: number;
};

function sumBetMap(betMap: Record<number, number>): number {
    return Object.values(betMap).reduce((sum, amount) => sum + amount, 0);
}

export default function PlayBoard({
    onOpenModal,
    onRepeatButtonClick,
    RoundId,
    isRoundRunning,
    onRoundFinished,
    repeatRequestId,
    RoundTime,
}: PlayBoardProps) {
    const [blockClick, setBlockClick] = useState<"auto" | "none">("none");
    const [showLedTimer, setShowLedTimer] = useState(false);
    const [showChooseTimer, setShowChooseTimer] = useState(false);
    const [showHiddenTimer, setShowHiddenTimer] = useState(false);
    const [showBoardOpacity, setShowBoardOpacity] = useState(false);
    const [showHand, setShowHand] = useState(false);
    const [showChooseRectangle, setShowChooseRectangle] = useState(false);
    const [currentBetAmount, setCurrentBetAmount] = useState(100);
    const [displayedBets, setDisplayedBets] = useState<Record<number, number>>({});
    const [queuedBets, setQueuedBets] = useState<Record<number, number>>({});
    const [serverErrorMessage, setServerErrorMessage] = useState<string | null>(null);
    const [hasStartedFinalBetWindow, setHasStartedFinalBetWindow] = useState(false);
    const [ledTime, setLedTime] = useState(0);
    const [chooseTime, setChooseTime] = useState(0);
    const [resultTime, setResultTime] = useState(0);
    const [hiddenTime, setHiddenTime] = useState(0);
    // const [resetKey, setResetKey] = useState(0);
    const [showResultTimer, setShowResultTimer] = useState(false);
    const {
        betAmounts,
        options,
        results,
        clearCurrentRoundBets,
        placeBet,
        previousRoundBets,
        reserveBetBalance,
        releaseBetBalance,
        playerInfo,
        setPreviousRoundBets,
    } = useGame();
    const queuedBetsRef = useRef<Record<number, number>>({});
    const isSendingBetRef = useRef(false);
    const repeatRequestIdRef = useRef(repeatRequestId);
    const errorTimeoutRef = useRef<number | null>(null);
    const optionMap = useMemo(() => {
        return Object.fromEntries(
            options.map(o => [o.id, o.logo])
        );
    }, [options]);
    const roundKey = RoundId ?? "waiting";
    const playerBalance = Number.parseFloat(playerInfo?.balance ?? "0");

    const showTemporaryMessage = (message: string, duration = 3000) => {
        setServerErrorMessage(message);

        if (errorTimeoutRef.current !== null) {
            window.clearTimeout(errorTimeoutRef.current);
        }

        errorTimeoutRef.current = window.setTimeout(() => {
            setServerErrorMessage(null);
            errorTimeoutRef.current = null;
        }, duration);
    };

    const applyBetBatch = (betBatch: Record<number, number>) => {
        const betEntries = Object.entries(betBatch)
            .map(([optionId, amount]) => [Number(optionId), amount] as const)
            .filter(([, amount]) => amount > 0);

        if (betEntries.length === 0) {
            return;
        }

        const totalAmount = betEntries.reduce((sum, [, amount]) => sum + amount, 0);
        const queuedTotal = sumBetMap(queuedBetsRef.current);

        if ((playerBalance - queuedTotal) < totalAmount) {
            showTemporaryMessage("Sorry balance is bad");
            return;
        }

        setServerErrorMessage(null);
        setDisplayedBets((prev) => {
            const next = { ...prev };
            betEntries.forEach(([optionId, amount]) => {
                next[optionId] = (next[optionId] ?? 0) + amount;
            });
            return next;
        });
        setQueuedBets((prev) => {
            const next = { ...prev };
            betEntries.forEach(([optionId, amount]) => {
                next[optionId] = (next[optionId] ?? 0) + amount;
            });
            return next;
        });
        reserveBetBalance(totalAmount);
    };

    const getResultOptionLogo = (id: number) =>
        optionMap[id] ? resolveAssetUrl(optionMap[id]) : "";

    useEffect(() => {
        queuedBetsRef.current = queuedBets;
    }, [queuedBets]);

    useEffect(() => {
        return () => {
            if (errorTimeoutRef.current !== null) {
                window.clearTimeout(errorTimeoutRef.current);
            }
        };
    }, []);

    useEffect(() => {

        if (RoundTime >= 12) {
            setLedTime(Math.floor(RoundTime) - 11);
            setChooseTime(7);
            setResultTime(1);
            setHiddenTime(3);
            setBlockClick("auto");
            setShowLedTimer(true);
            setShowChooseTimer(false);
            setShowHiddenTimer(false);
            setShowBoardOpacity(false);
            setShowChooseRectangle(false);
            setShowHand(true);
            setDisplayedBets({});
            setQueuedBets({});
            queuedBetsRef.current = {};
            isSendingBetRef.current = false;
            setServerErrorMessage(null);
            setHasStartedFinalBetWindow(false);
        } else if (RoundTime < 12 && RoundTime >= 5) {
            setLedTime(27);
            setChooseTime(Math.floor(RoundTime) - 4);
            setResultTime(1);
            setHiddenTime(3);
            setBlockClick("none");
            setShowLedTimer(false);
            setShowChooseTimer(true);
            setShowHiddenTimer(false);
            setShowBoardOpacity(true);
            setShowChooseRectangle(true);
            setShowHand(false);
            setDisplayedBets({});
            setQueuedBets({});
            queuedBetsRef.current = {};
            isSendingBetRef.current = false;
            setServerErrorMessage(null);
            setHasStartedFinalBetWindow(false);
        } else if (RoundTime < 5 && RoundTime >= 4) {
            setLedTime(27);
            setChooseTime(7);
            setResultTime(1);
            setHiddenTime(3);
            setBlockClick("auto");
            setShowLedTimer(true);
            setShowChooseTimer(false);
            setShowHiddenTimer(false);
            setShowBoardOpacity(false);
            setShowChooseRectangle(false);
            setShowHand(true);
            setDisplayedBets({});
            setQueuedBets({});
            queuedBetsRef.current = {};
            isSendingBetRef.current = false;
            setServerErrorMessage(null);
            setHasStartedFinalBetWindow(false);
            setShowResultTimer(true)
        } else if (RoundTime < 4 && RoundTime >= 1) {
            setLedTime(27);
            setChooseTime(7);
            setResultTime(1);
            setHiddenTime(Math.floor(RoundTime));
            setBlockClick("auto");
            setShowLedTimer(true);
            setShowChooseTimer(false);
            setShowHiddenTimer(true);
            setShowBoardOpacity(false);
            setShowChooseRectangle(false);
            setShowHand(true);
            setDisplayedBets({});
            setQueuedBets({});
            queuedBetsRef.current = {};
            isSendingBetRef.current = false;
            setServerErrorMessage(null);
            setHasStartedFinalBetWindow(false);
            onOpenModal("result");
            setShowResultTimer(false)
        } else if (RoundTime < 1) {
            // setChooseTime(5);
            // setResultTime(1);
            // setHiddenTime(3);
            setBlockClick("none");
            setShowLedTimer(false);
            setShowChooseTimer(false);
            setShowHiddenTimer(false);
            setShowBoardOpacity(false);
            setShowChooseRectangle(false);
            setShowHand(false);
            setDisplayedBets({});
            setQueuedBets({});
            queuedBetsRef.current = {};
            isSendingBetRef.current = false;
            setServerErrorMessage(null);
            setHasStartedFinalBetWindow(false);
            return;
        }
    }, [RoundId, isRoundRunning]);
    useEffect(() => console.log("RoundTime", results), [])
    useEffect(() => {
        if (isRoundRunning && RoundId) {
            clearCurrentRoundBets();
        }
    }, [RoundId, isRoundRunning, clearCurrentRoundBets]);

    const handleBetOption = (optionId: number, amount: number) => {
        if (blockClick === "none" || hasStartedFinalBetWindow) {
            return;
        }

        const queuedTotal = sumBetMap(queuedBetsRef.current);

        if ((playerBalance - queuedTotal) < amount) {
            return;
        }

        setServerErrorMessage(null);
        setDisplayedBets((prev) => ({
            ...prev,
            [optionId]: (prev[optionId] ?? 0) + amount,
        }));
        setQueuedBets((prev) => ({
            ...prev,
            [optionId]: (prev[optionId] ?? 0) + amount,
        }));
        reserveBetBalance(amount);
    };

    useEffect(() => {
        if (repeatRequestId === repeatRequestIdRef.current) {
            return;
        }

        repeatRequestIdRef.current = repeatRequestId;

        if (blockClick === "none" || hasStartedFinalBetWindow) {
            return;
        }

        applyBetBatch(previousRoundBets);
    }, [repeatRequestId, blockClick, hasStartedFinalBetWindow, previousRoundBets]);

    useEffect(() => {
        if (!hasStartedFinalBetWindow) {
            return;
        }

        const intervalId = window.setInterval(() => {
            if (isSendingBetRef.current) return;

            const batch = { ...queuedBetsRef.current };

            const hasBets = Object.values(batch).some((amount) => amount > 0);
            if (!hasBets) return;

            // 🔥 clear queue immediately
            queuedBetsRef.current = {};
            setQueuedBets({});

            isSendingBetRef.current = true;

            Promise.all(
                Object.entries(batch).map(([optionId, amount]) =>
                    placeBet(Number(optionId), amount)
                )
            )
                .catch(() => {
                    const total = Object.values(batch).reduce((a, b) => a + b, 0);
                    releaseBetBalance(total);
                    setServerErrorMessage("Server not response");
                })
                .finally(() => {
                    isSendingBetRef.current = false;
                });
        }, 30);

        return () => {
            window.clearInterval(intervalId);
        };
    }, [hasStartedFinalBetWindow, placeBet, releaseBetBalance]);

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
                    {serverErrorMessage ?? (RoundId ? (`Round ${RoundId} of today`) : (`Please wait next round`))}
                </span>
                <img
                    src={getAssetUrl(GAME_ASSETS.fruitContainerFrame)}
                    className="absolute left-1/2 top-[90px] z-20 -translate-x-1/2 transform"
                />
                {showHand && (
                    <MovingHand />
                )}
                <GameElements
                    controlButtons={blockClick}
                    currentBetAmount={currentBetAmount}
                    // removeBet={resetKey}
                    displayedBets={displayedBets}
                    onBetOption={handleBetOption}
                />
                <img
                    src={getAssetUrl(GAME_ASSETS.timeCountingBoard)}
                    className="absolute left-[calc(50%-1px)] top-[183px] z-40 -translate-x-1/2 transform"
                />
                <button
                    style={{
                        cursor: "pointer",
                        pointerEvents: "auto",
                    }}
                    onClick={onRepeatButtonClick}
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
                        );
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
                                {result.is_jackpot === 0 && (
                                    <img
                                        src={getResultOptionLogo(result.option_id)}
                                        alt={result.option_name || `Result ${index + 1}`}
                                        className="absolute inset-0 h-full w-full"
                                    />
                                )}
                                {result.is_jackpot === 1 && (
                                    <img
                                        src={getAssetUrl("fruit-jackpot/big.svg")}
                                        alt={result.option_name || `Result ${index + 1}`}
                                        className="absolute inset-0 h-full w-full"
                                    />
                                )}
                                {result.is_jackpot === 2 && (
                                    <img
                                        src={getAssetUrl("fruit-jackpot/small.svg")}
                                        alt={result.option_name || `Result ${index + 1}`}
                                        className="absolute inset-0 h-full w-full"
                                    />
                                )}
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
                            start={ledTime}
                            onLedTimeUp={() => {
                                setHasStartedFinalBetWindow(true);
                                setPreviousRoundBets(displayedBets);
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
                            start={chooseTime}

                            onChooseTimeUp={() => {
                                setShowChooseTimer(false);
                                setShowResultTimer(true)
                                setShowBoardOpacity(false);
                                setShowChooseRectangle(false);
                                // setResetKey(prev => prev + 1);
                            }}
                        />
                    </div>
                )}
                {showResultTimer && (
                    <div className='absolute top-[90px] h-[271px] w-[280px] z-30 left-1/2 transform -translate-x-1/2'>
                        <ResultTimer
                            start={resultTime}
                            // RoundId={RoundId}
                            onResultTimeUp={() => {
                                onOpenModal("result");
                                setShowHiddenTimer(true);
                                setShowResultTimer(false)

                            }} />
                    </div>
                )}
                {showHiddenTimer && (
                    <div className="absolute left-1/2 top-[197px] z-30 -translate-x-1/2 transform">
                        <HiddenTimer
                            key={`hidden-${roundKey}`}
                            start={hiddenTime}
                            onHiddenTimeUp={() => {
                                setShowHiddenTimer(false);
                                setShowHand(false);
                                setBlockClick("none");
                                onRoundFinished();
                            }}
                        />
                    </div>
                )}
                {showChooseRectangle && (
                    <ChooseRectangle
                        RoundId={RoundId}
                        onChooseTimeUp={() => {
                            setShowChooseRectangle(false);
                        }}
                    />
                )}
            </div>
        </div>
    );
}
