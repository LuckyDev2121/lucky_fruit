import React, { useEffect, useState } from 'react';
import { type GameElement, getGameElements } from '../api/gameElementApi';

const GameElements = () => {
    const [gameElements, setGameElements] = useState<GameElement[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchGameElements = async () => {
            try {
                const data = await getGameElements();
                setGameElements(data);
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            }
        };
        fetchGameElements(); // Call the async function
    }, []);
    console.log("Successful", gameElements);

    return (
        <div className='relative top-[90px] h-[271px] w-[280px] z-30 grid grid-cols-3 grid-rows-3 left-1/2 transform -translate-x-1/2'>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {gameElements.map((element, index) => {
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
                // let position = '';
                // if (index === 0) position = 'top-[px] left-[0px]'; // 1st button
                // else if (index === 1) position = ''; // 2nd button
                // else if (index === 2) position = ''; // 3rd button
                // else if (index === 3) position = ''; // 4th button
                // else if (index === 4) position = ''; // 5th button
                // else if (index === 5) position = ''; // 6th button
                // else if (index === 6) position = ''; // 7th button
                // else if (index === 7) position = ''; // 8th button

                return (
                    <button
                        key={element.id}
                        onClick={() => console.log(`Clicked on ${element.element_name}`)}
                        className={`relative ${gridPosition} `}>
                        <img
                            src={element.element_icon}
                            alt={element.element_name}
                            style={{ width: 70, height: 70 }}
                            className='absolute top-[0px] m-auto justify-center left-0 right-0'
                        />

                        {(element.id === 33 || element.id === 32 || element.id === 31 || element.id === 26) && (
                            <span className='absolute top-[64px] m-auto justify-center left-0 right-0'>5 Times</span>
                        )}
                        {element.id === 30 && <span className='absolute top-[64px] m-auto justify-center left-0 right-0'>10 Times</span>}
                        {element.id === 29 && <span className='absolute top-[64px] m-auto justify-center left-0 right-0'>15 Times</span>}
                        {element.id === 28 && <span className='absolute top-[64px] m-auto justify-center left-0 right-0'>25 Times</span>}
                        {element.id === 27 && <span className='absolute top-[64px] m-auto justify-center left-0 right-0'>40 Times</span>}
                    </button>
                );
            })}
        </div>
        // <div className='absolute top-[90px]  z-30 grid grid-cols-3 grid-rows-3 gap-4'>
        //     {error && <p style={{ color: 'red' }}>{error}</p>}
        //     {gameElements.map((element, index) => (
        //         <button key={element.id}
        //             onClick={() => console.log(`Clicked on ${element.element_name}`)}
        //             className='relative'>
        //             <img
        //                 src={element.element_icon}
        //                 alt={element.element_name}
        //                 style={{ width: 60, height: 60 }}
        //             // className='absolute '
        //             />
        //             {(element.id === 33 || element.id === 32 || element.id === 31 || element.id === 26) && (
        //                 <span className='absolute'>x5</span>
        //             )}
        //             {element.id === 30 && (
        //                 <span className='absolute'>x10</span>
        //             )}
        //             {element.id === 29 && (
        //                 <span className='absolute'>x15</span>
        //             )}
        //             {element.id === 28 && (
        //                 <span className='absolute'>x25</span>
        //             )}
        //             {element.id === 27 && (
        //                 <span className='absolute'>x40</span>
        //             )}
        //         </button>
        //     ))}
        // </div>
    );
};

export default GameElements;
