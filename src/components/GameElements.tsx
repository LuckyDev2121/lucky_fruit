// import React, { useEffect, useState } from 'react';
// import { type GameElement, fetchGameElements } from '../api/gameElementApi';
import { useGameDetails, resolveAssetUrl } from '../hooks/useGameDetails';

type FruitBoardProps = {
    controlButtons: "auto" | "none";
};

const GameElements = ({ controlButtons }: FruitBoardProps) => {

    const { options } = useGameDetails();

    // const [gameElements, setGameElements] = useState<GameElement[]>([]);
    // const [error, setError] = useState<string | null>(null);

    // useEffect(() => {
    //     const loadGameElements = async () => {
    //         try {
    //             const data = await fetchGameElements();
    //             setGameElements(data);
    //         } catch (error) {
    //             if (error instanceof Error) {
    //                 setError(error.message);
    //             } else {
    //                 setError('An unknown error occurred');
    //             }
    //         }
    //     };
    //     loadGameElements();
    // }, []);

    return (
        <div className='relative top-[90px] h-[271px] w-[280px] z-30 grid grid-cols-3 grid-rows-3 left-1/2 transform -translate-x-1/2' style={{ pointerEvents: controlButtons }}>
            {/* {error && <p style={{ color: 'red' }}>{error}</p>} */}

            {options.map((element, index) => {
                // Custom grid positioning for each button
                let gridPosition = '';
                if (index === 0) gridPosition = 'col-start-2 row-start-1'; // 1st button
                else if (index === 1) gridPosition = 'col-start-3 row-start-1'; // 2nd button
                else if (index === 2) gridPosition = 'col-start-3 row-start-2'; // 3rd button
                else if (index === 3) gridPosition = 'col-start-3 row-start-3'; // 4th button
                else if (index === 4) gridPosition = 'col-start-2 row-start-3'; // 5th button
                else if (index === 5) gridPosition = 'col-start-1 row-start-3'; // 6th button
                else if (index === 6) gridPosition = 'col-start-1 row-start-2'; // 7th button
                else if (index === 7) gridPosition = 'col-start-1 row-start-1'; // 8th button
                return (
                    <button
                        key={element.id}
                        style={{ cursor: 'pointer' }}
                        onClick={() => console.log(`Clicked on ${element.id}`)}
                        className={`relative ${gridPosition} `}>
                        <img
                            src={resolveAssetUrl(element.logo)}
                            style={{ width: 70, height: 70 }}
                            className='absolute top-[4px] m-auto justify-center left-0 right-0'
                        />
                        <span className='absolute top-[68px] m-auto justify-center font-bold left-0 right-0'>{element.name}</span>
                    </button>
                );
            })}
        </div>
    );
};

export default GameElements;
