
import { useEffect, useRef, } from "react";
import { useGame } from '../hooks/useGameHook';
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";

type ResultTimerProps = {
    start?: number;
    onResultTimeUp?: () => void;
};

export default function ResultTimer({ start, onResultTimeUp }: ResultTimerProps) {
    const duration = Math.max(0, start ?? 0);
    const onResultTimeUpRef = useRef(onResultTimeUp);
    const { makeResult, createRound } = useGame();
    // const [currentOptionId, setCurrentOptionid] = useState<number | null>(null);

    // const attemptStartRound = useCallback(async () => {
    //     try {
    //         const res = await createRound();

    //         if (!res?.status || !res.data) {
    //             return false;
    //         }
    //         setCurrentOptionid(res.data?.winning_option_id)
    //         return true;
    //     } catch (err) {
    //         console.error(err);
    //         return false;
    //     }
    // }, [createRound]);

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
            {makeResult?.winning_option_id === 12 ?
                <div className="relative col-start-1 row-start-2 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="relative" />
                </div> : <div className={`relative col-start-1 row-start-2 z-40 bg-black/50 rounded-[8px]`} />
            }
            {makeResult?.winning_option_id === 11 ?
                <div className="relative col-start-1 row-start-3 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="relative" />
                </div> : <div className={`relative col-start-1 row-start-3 z-40 bg-black/50 rounded-[8px]`} />
            }
            {makeResult?.winning_option_id === 10 ?
                <div className="relative col-start-2 row-start-3 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="relative" />
                </div> : <div className={`relative col-start-2 row-start-3 z-40 bg-black/50 rounded-[8px]`} />
            }
            {makeResult?.winning_option_id === 9 ?
                <div className="relative col-start-3 row-start-3 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="relative" />
                </div> : <div className={`relative col-start-3 row-start-3 z-40 bg-black/50 rounded-[8px]`} />
            }
            {makeResult?.winning_option_id === 8 ?
                <div className="relative col-start-3 row-start-2 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="relative" />
                </div> : <div className={`relative col-start-3 row-start-2 z-40 bg-black/50 rounded-[8px]`} />
            }
            {makeResult?.winning_option_id === 7 ?
                <div className="relative col-start-3 row-start-1 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="relative" />
                </div> : <div className={`relative col-start-3 row-start-1 z-40 bg-black/50 rounded-[8px]`} />
            }
            {makeResult?.winning_option_id === 6 ?
                <div className="relative col-start-2 row-start-1 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="relative" />
                </div> : <div className={`relative col-start-2 row-start-1 z-40 bg-black/50 rounded-[8px]`} />
            }
            {makeResult?.winning_option_id === 5 ?
                <div className="relative col-start-1 row-start-1 z-40" >
                    <img src={getAssetUrl(GAME_ASSETS.selectround)} alt="Choose Rectangle" className="relative" />
                </div> : <div className={`relative col-start-1 row-start-1 z-40 bg-black/50 rounded-[8px]`} />
            }
        </div >
    );
}
