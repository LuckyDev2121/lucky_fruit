import { useEffect, useRef, } from "react";
import { useGame } from '../hooks/useGameHook';
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";

type ResultTimerProps = {
    start?: number;
    onResultTimeUp?: () => void;
    RoundId?: number | null;
};

export default function ResultTimer({ start, onResultTimeUp }: ResultTimerProps) {
    const duration = Math.max(0, start ?? 0);
    const onResultTimeUpRef = useRef(onResultTimeUp);
    const { makeResult, } = useGame();
    const activeResult = makeResult;
    const winningIds = Array.isArray(activeResult?.winning_option_id)
        ? activeResult.winning_option_id.map(Number)
        : activeResult?.winning_option_id !== undefined
            ? [activeResult.winning_option_id]
            : [];

    const gridMap = [
        { id: 12, col: 1, row: 2 },
        { id: 11, col: 1, row: 3 },
        { id: 10, col: 2, row: 3 },
        { id: 9, col: 3, row: 3 },
        { id: 8, col: 3, row: 2 },
        { id: 7, col: 3, row: 1 },
        { id: 6, col: 2, row: 1 },
        { id: 5, col: 1, row: 1 },
    ];

    useEffect(() => {
        onResultTimeUpRef.current = onResultTimeUp;
    }, [onResultTimeUp]);

    useEffect(() => {
        if (duration <= 0) {
            onResultTimeUpRef.current?.();
            return;
        }

        const timer = window.setTimeout(() => {
            onResultTimeUpRef.current?.();
        }, duration * 1000);

        return () => window.clearTimeout(timer);
    }, [duration]);

    return (
        <div className='absolute left-[3px] top-[4px] h-[263px] w-[274px] z-30 grid grid-cols-3 grid-rows-3  '>
            {gridMap.map((item) => (
                winningIds.includes(item.id) ? (
                    <div key={item.id} className={`relative col-start-${item.col} row-start-${item.row} z-40`}>
                        <img
                            src={getAssetUrl(GAME_ASSETS.selectround)}
                            className="absolute -left-[2px] -top-[8px] h-[100px] w-[96px]"
                        />
                    </div>
                ) : (
                    <div
                        key={item.id}
                        className={`relative col-start-${item.col} row-start-${item.row} z-40 bg-black/50 rounded-[8px]`}
                    />
                )
            ))}
        </div >
    );
}
