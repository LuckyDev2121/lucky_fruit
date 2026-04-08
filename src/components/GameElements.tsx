import { useEffect } from 'react';
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";
import { useGame, resolveAssetUrl } from '../hooks/useGameHook';

type FruitBoardProps = {
    controlButtons: "auto" | "none";
    currentBetAmount: number;
    displayedBets: Record<number, number>;
    onBetOption: (optionId: number, amount: number) => void;
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

const GameElements = ({ controlButtons, currentBetAmount, displayedBets, onBetOption }: FruitBoardProps) => {
    const { options, playerInfo } = useGame();

    useEffect(() => {
        if (!options.length) return;
        options.forEach((element) => {
            const img = new Image();
            img.src = resolveAssetUrl(element.logo);
        });
    }, [options]);

    const balance = Number.parseFloat(playerInfo?.balance ?? "0");

    return (
        <div className='relative top-[90px] h-[271px] w-[280px] z-30 grid grid-cols-3 grid-rows-3 left-1/2 transform -translate-x-1/2' style={{ pointerEvents: controlButtons }}>
            {options.map((element, index) => {
                let gridPosition = '';
                if (index === 0) gridPosition = 'col-start-1 row-start-1';
                else if (index === 1) gridPosition = 'col-start-2 row-start-1';
                else if (index === 2) gridPosition = 'col-start-3 row-start-1';
                else if (index === 3) gridPosition = 'col-start-3 row-start-2';
                else if (index === 4) gridPosition = 'col-start-3 row-start-3';
                else if (index === 5) gridPosition = 'col-start-2 row-start-3';
                else if (index === 6) gridPosition = 'col-start-1 row-start-3';
                else if (index === 7) gridPosition = 'col-start-1 row-start-2';

                const shownBetAmount = displayedBets[element.id] ?? 0;

                return (
                    <button
                        key={element.id}
                        type="button"
                        disabled={controlButtons === "none" || balance < currentBetAmount}
                        style={{
                            cursor: controlButtons === "none" || balance < currentBetAmount ? 'default' : 'pointer',
                            touchAction: "manipulation",
                        }}
                        onPointerDown={() => onBetOption(element.id, currentBetAmount)}
                        className={`relative ${gridPosition} `}
                    >
                        <img
                            src={resolveAssetUrl(element.logo)}
                            style={{ width: 70, height: 70 }}
                            className='absolute top-[4px] m-auto justify-center left-0 right-0'
                        />
                        <span className='absolute top-[68px] m-auto justify-center font-bold left-0 right-0'>{element.name}</span>
                        {shownBetAmount > 0 && (
                            <div className='absolute h-[87px] w-[87px] top-[2px] left-[3px] bg-black/30 flex items-center justify-center rounded-[8px]'>
                                <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" className="flex h-[9px] w-[16px] mr-[3px] mt-1" />
                                <span className='flex '>{formatNumber(shownBetAmount)}</span>
                            </div>
                        )}
                    </button>
                );
            })}
        </div >
    );
};

export default GameElements;
