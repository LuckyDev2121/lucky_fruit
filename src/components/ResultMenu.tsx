import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";
import ModalHeaderPlate from "./ModalHeaderPlate";
import ResultMenuDivider from "./ResultMenuDivider";
import { useGame, resolveAssetUrl } from "../hooks/useGameHook";

type ResultMenuProps = {
    start?: number;
    onResultTimeUp?: () => void;
};

function formatDiamondAmount(amount: number): string {
    if (amount >= 1_000_000_000) {
        return `${(amount / 1_000_000_000).toFixed(1).replace(/\.0$/, "")}B`;
    }
    if (amount >= 1_000_000) {
        return `${(amount / 1_000_000).toFixed(1).replace(/\.0$/, "")}M`;
    }
    if (amount >= 1_000) {
        return `${(amount / 1_000).toFixed(1).replace(/\.0$/, "")}K`;
    }

    return amount.toString();
}

export default function ResultMenu({ start, onResultTimeUp }: ResultMenuProps) {
    const [showIcon, setShowIcon] = useState(false);
    const [consol, setConsol] = useState(0);
    const initialTime = Math.max(0, start ?? 0);
    const [time, setTime] = useState(initialTime);
    const onResultTimeUpRef = useRef(onResultTimeUp);
    const { options, makeResult: result, makeGameResult, currentRoundBets, refreshGameData } = useGame();

    const optionMap = useMemo(() => {
        return Object.fromEntries(options.map(o => [o.id, o.logo]));
    }, [options]);
    const totalBetAmount = useMemo(() => {
        return Object.values(currentRoundBets).reduce((sum, amount) => sum + amount, 0);
    }, [currentRoundBets]);
    const winningDiamondAmount = useMemo(() => {
        if (!result) {
            return 0;
        }

        return currentRoundBets[result.winning_option_id] ?? 0;
    }, [currentRoundBets, result]);
    const resultMessage = useMemo(() => {
        if (totalBetAmount === 0) {
            return "Did not participate in this round";
        }

        if (winningDiamondAmount > 0) {
            return "Congratelations on getting diamonds";
        }

        return "Sorry, didn't win this round";
    }, [totalBetAmount, winningDiamondAmount]);

    const getResultOptionLogo = (optionId: number) => {
        return optionMap[optionId]
            ? resolveAssetUrl(optionMap[optionId])
            : "";
    };

    useEffect(() => {
        makeGameResult();
        onResultTimeUpRef.current = onResultTimeUp;
    }, [onResultTimeUp]);

    useEffect(() => {
        void refreshGameData({ resetPendingBalanceDeduction: true });
    }, [refreshGameData]);

    useEffect(() => {
        if (consol === 0) {
            console.log("result", result);
            setConsol(1);
        }
    }, [consol]);

    useEffect(() => {
        if (winningDiamondAmount > 0) setShowIcon(true);
        else setShowIcon(false);
    }, [winningDiamondAmount]);

    useEffect(() => {
        setTime(initialTime);
    }, [initialTime]);

    useEffect(() => {
        if (initialTime <= 0) {
            onResultTimeUpRef.current?.();
            return;
        }

        const timer = window.setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    window.clearInterval(timer);
                    onResultTimeUpRef.current?.();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => window.clearInterval(timer);
    }, [initialTime]);

    const formatted = String(time).padStart(2, "0");

    return (
        <div className="relative h-[342px] w-[393px] overflow-hidden rounded-t-[20px] bg-gradient-to-t from-[#7C00D5] to-[#5028C1]">

            <ModalHeaderPlate className="absolute left-1/2 -translate-x-1/2" />
            <span className="absolute  left-1/2 transform -translate-x-1/2 text-sm font-bold mt-1">Round {result?.round_no} of Today</span>
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
            {result && (
                <img
                    src={getResultOptionLogo(result.winning_option_id)}
                    alt="selectedFruit"
                    className={`absolute left-1/2 -translate-x-1/2 top-[70px] h-[85px] w-[85px]`}
                />
            )}
            <div className="absolute left-1/2 top-[191px] flex -translate-x-1/2 items-center justify-center gap-1 whitespace-nowrap">
                <span>{resultMessage}</span>
                {showIcon && (
                    <>
                        <img
                            src={getAssetUrl(GAME_ASSETS.diamondIcon)}
                            alt="Diamond Icon"
                            className="h-[9px] w-[16px]"
                        />
                        <span>{winningDiamondAmount > 0 ? formatDiamondAmount(winningDiamondAmount) : "0"}</span>
                    </>
                )}
            </div>
            <ResultMenuDivider className="absolute left-[61px] top-[221px]" direction="left" />
            <ResultMenuDivider className="absolute left-[281px] top-[221px]" direction="right" />
            <span className="absolute left-1/2 -translate-x-1/2 top-[215px] text-[#FFFFFF]/60">Biggest winning of the round</span>
            <div className="absolute grid grid-cols-3 top-[244px] w-[300px] h-[100px] left-1/2 -translate-x-1/2 ">
                <div className="relative h-[100px] w-[100px]">
                    <img src={resolveAssetUrl(result?.winners?.[0]?.avater ?? "")} alt="abatar" className="absolute w-[50px] h-[50px] left-1/2 -translate-x-1/2" />
                    <span className="absolute top-[50px] w-[100px] text-center">{result?.winners?.[0]?.id ?? "N/A"}</span>
                    <div className="absolute flex top-[70px] w-[100px] items-center justify-center">
                        <div className="relative ">
                            <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" className="h-[9px] w-[16px] mr-[3px]" />
                        </div>
                        <span >{result?.winners?.[0]?.balance ?? "***"}</span>
                    </div>
                </div>
                <div className="relative h-[100px] w-[100px]">
                    <img src={resolveAssetUrl(result?.winners?.[1]?.avater ?? "")} alt="abatar" className="absolute w-[50px] h-[50px] left-1/2 -translate-x-1/2" />
                    <span className="absolute top-[50px] w-[100px] text-center">{result?.winners?.[1]?.id ?? "N/A"}</span>
                    <div className="absolute flex top-[70px] w-[100px] items-center justify-center">
                        <div className="relative ">
                            <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" className="h-[9px] w-[16px] mr-[3px]" />
                        </div>
                        <span >{result?.winners?.[1]?.balance ?? "***"}</span>
                    </div>
                </div>
                <div className="relative h-[100px] w-[100px]">
                    <img src={resolveAssetUrl(result?.winners?.[2]?.avater ?? "")} alt="image" className="absolute w-[50px] h-[50px] left-1/2 -translate-x-1/2" />
                    <span className="absolute top-[50px] w-[100px] text-center">{result?.winners?.[2]?.id ?? "N/A"}</span>
                    <div className="absolute flex top-[70px] w-[100px] items-center justify-center">
                        <div className="relative ">
                            <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" className="h-[9px] w-[16px] mr-[3px]" />
                        </div>
                        <span >{result?.winners?.[2]?.balance ?? "***"}</span>
                    </div>
                </div>
            </div>
        </div>
    )
}

