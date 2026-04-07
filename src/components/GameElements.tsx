import { useEffect, useState } from 'react';
// import { usePlaceBet } from '../hooks/usePlaceBet';
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";
import { useGame, resolveAssetUrl } from '../hooks/useGameHook';
import { placeBet } from '../api/api';
type FruitBoardProps = {
    controlButtons: "auto" | "none";
    currentBetAmount: number;
    removeBet: number;
};

function formatNumber(num: number): string {
    if (num >= 1_000_000_000) {
        return (num / 1_000_000_000).toFixed(1).replace(/\.0$/, '') + 'B';
    }
    if (num >= 1_000_000) {
        return (num / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1_000) {
        return (num / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
    }
    return num.toString();
}

const GameElements = ({ controlButtons, currentBetAmount, removeBet }: FruitBoardProps) => {

    const { options } = useGame();
    // const { place, } = usePlaceBet();
    const place = placeBet;
    const [betAmount, setBetAmount] = useState<number[]>([0, 0, 0, 0, 0, 0, 0, 0]);

    useEffect(() => {
        if (!options.length) return;
        options.forEach((element) => {
            const img = new Image();
            img.src = resolveAssetUrl(element.logo);
        });
    }, []);

    useEffect(() => {
        setBetAmount(Array(options.length).fill(0));
    }, [removeBet, options.length]);
    return (
        <div className='relative top-[90px] h-[271px] w-[280px] z-30 grid grid-cols-3 grid-rows-3 left-1/2 transform -translate-x-1/2' style={{ pointerEvents: controlButtons }}>

            {options.map((element, index) => {
                let gridPosition = '';
                if (index === 0) gridPosition = 'col-start-1 row-start-1'; // 1st button
                else if (index === 1) gridPosition = 'col-start-2 row-start-1'; // 2nd button
                else if (index === 2) gridPosition = 'col-start-3 row-start-1'; // 3rd button
                else if (index === 3) gridPosition = 'col-start-3 row-start-2'; // 4th button
                else if (index === 4) gridPosition = 'col-start-3 row-start-3'; // 5th button
                else if (index === 5) gridPosition = 'col-start-2 row-start-3'; // 6th button
                else if (index === 6) gridPosition = 'col-start-1 row-start-3'; // 7th button
                else if (index === 7) gridPosition = 'col-start-1 row-start-2'; // 8th button
                return (
                    <button
                        key={element.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => {
                            // if (isProcessing) return;
                            place(element.id, currentBetAmount);
                            setBetAmount((prev) => {

                                const newArr = [...prev];
                                newArr[index] += currentBetAmount;
                                return newArr;
                            });
                        }}
                        className={`relative ${gridPosition} `}>
                        <img
                            src={resolveAssetUrl(element.logo)}
                            style={{ width: 70, height: 70 }}
                            className='absolute top-[4px] m-auto justify-center left-0 right-0'
                        />
                        <span className='absolute top-[68px] m-auto justify-center font-bold left-0 right-0'>{element.name}</span>
                        {betAmount[index] > 0 && (
                            < div className='absolute h-[87px] w-[87px] top-[2px] left-[3px] bg-black/30 flex items-center justify-center rounded-[8px]'>
                                <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" className="flex h-[9px] w-[16px] mr-[3px] mt-1" />
                                <span className='flex '>{formatNumber(betAmount[index])}</span>
                            </div>)}
                    </button>
                );
            })}
        </div >
    );
};

export default GameElements;
