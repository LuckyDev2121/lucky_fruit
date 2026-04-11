import { useEffect, useRef, useState } from "react";
import { useGame } from '../hooks/useGameHook';
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";
import type { ResultData } from "../api/api";

type ResultTimerProps = {
    start?: number;
    onResultTimeUp?: () => void;
    RoundId?: number | null;
};

export default function ResultTimer({ start, RoundId, onResultTimeUp }: ResultTimerProps) {
    const duration = Math.max(0, start ?? 0);
    const onResultTimeUpRef = useRef(onResultTimeUp);
    const [resultResponse, setResultResponse] = useState<ResultData | null>(null);;
    const { makeResult, makeGameRound, } = useGame();
    const activeResult = resultResponse ?? makeResult;

    useEffect(() => {
        onResultTimeUpRef.current = onResultTimeUp;
    }, [onResultTimeUp]);

    useEffect(() => {
        let isMounted = true;

        if (RoundId) {
            void makeGameRound(RoundId)
                .then((response) => {
                    if (isMounted) {
                        setResultResponse(response);
                    }
                })
                .catch((error) => {
                    console.error(error);
                });
        }

        return () => {
            isMounted = false;
        };
    }, [makeGameRound, RoundId]);
    useEffect(() => {
        console.log("activeResult", activeResult)
    }, [])
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
            {activeResult?.winning_option_id === 12 ?
                <div className="relative col-start-1 row-start-2 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="absolute -left-[2px] -top-[8px] h-[100px] w-[96px]" />
                </div> : <div className={`relative col-start-1 row-start-2 z-40 bg-black/50 rounded-[8px]`} />
            }
            {activeResult?.winning_option_id === 11 ?
                <div className="relative col-start-1 row-start-3 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="absolute -left-[2px] -top-[8px] h-[100px] w-[96px]" />
                </div> : <div className={`relative col-start-1 row-start-3 z-40 bg-black/50 rounded-[8px]`} />
            }
            {activeResult?.winning_option_id === 10 ?
                <div className="relative col-start-2 row-start-3 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="absolute -left-[2px] -top-[8px] h-[100px] w-[96px]" />
                </div> : <div className={`relative col-start-2 row-start-3 z-40 bg-black/50 rounded-[8px]`} />
            }
            {activeResult?.winning_option_id === 9 ?
                <div className="relative left-[5px] col-start-3 row-start-3 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="absolute -left-[2px] -top-[8px] h-[100px] w-[96px]" />
                </div> : <div className={`relative col-start-3 row-start-3 z-40 bg-black/50 rounded-[8px]`} />
            }
            {activeResult?.winning_option_id === 8 ?
                <div className="relative left-[5px] col-start-3 row-start-2 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="absolute  -left-[2px] -top-[8px] h-[100px] w-[96px]" />
                </div> : <div className={`relative col-start-3 row-start-2 z-40 bg-black/50 rounded-[8px]`} />
            }
            {activeResult?.winning_option_id === 7 ?
                <div className="relative left-[5px] col-start-3 row-start-1 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="absolute -left-[2px] -top-[8px] h-[100px] w-[96px]" />
                </div> : <div className={`relative col-start-3 row-start-1 z-40 bg-black/50 rounded-[8px]`} />
            }
            {activeResult?.winning_option_id === 6 ?
                <div className="relative col-start-2 row-start-1 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="absolute -left-[2px] -top-[8px] h-[100px] w-[96px]" />
                </div> : <div className={`relative col-start-2 row-start-1 z-40 bg-black/50 rounded-[8px]`} />
            }
            {activeResult?.winning_option_id === 5 ?
                <div className="relative col-start-1 row-start-1 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="absolute -left-[2px] -top-[8px] h-[100px] w-[96px]" />
                </div> : <div className={`relative col-start-1 row-start-1 z-40 bg-black/50 rounded-[8px]`} />
            }
        </div >
    );
}
