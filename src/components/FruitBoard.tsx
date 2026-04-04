import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";

const fruits = [
    { id: 0, element_name: "Kiwi", element_icon: getAssetUrl(GAME_ASSETS.fruitAvocado) },
    { id: 1, element_name: "Orange", element_icon: getAssetUrl(GAME_ASSETS.fruitOrange) },
    { id: 2, element_name: "Lemon", element_icon: getAssetUrl(GAME_ASSETS.fruitLemon) },
    { id: 3, element_name: "Cherry", element_icon: getAssetUrl(GAME_ASSETS.fruitCheri) },
    { id: 4, element_name: "Strawberry", element_icon: getAssetUrl(GAME_ASSETS.fruitStroberry) },
    { id: 5, element_name: "Grape", element_icon: getAssetUrl(GAME_ASSETS.fruitGraps) },
    { id: 6, element_name: "Watermelon", element_icon: getAssetUrl(GAME_ASSETS.fruitWatermalon) },
    { id: 7, element_name: "Tomato", element_icon: getAssetUrl(GAME_ASSETS.fruitTomato) }
];

type FruitBoardProps = {
    controlButtons: "auto" | "none";
};

export default function FruitBoard({ controlButtons }: FruitBoardProps) {


    return (
        <div className='relative top-[90px] h-[271px] w-[280px] z-30 grid grid-cols-3 grid-rows-3 left-1/2 transform -translate-x-1/2' style={{ pointerEvents: controlButtons }}>
            {fruits.map((element, index) => {
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
                        onClick={() => console.log(`Clicked on ${element.element_name}`)}
                        className={`relative ${gridPosition} `}>
                        <img
                            src={element.element_icon}
                            alt={element.element_name}
                            style={{ width: 70, height: 70 }}
                            className='absolute top-[0px] m-auto justify-center left-0 right-0'
                        />

                        {(element.id === 7 || element.id === 0 || element.id === 1 || element.id === 2) && (
                            <span className='absolute top-[64px] m-auto justify-center font-bold left-0 right-0'>5 Times</span>
                        )}
                        {element.id === 3 && <span className='absolute top-[64px] m-auto justify-center font-bold left-0 right-0'>10 Times</span>}
                        {element.id === 4 && <span className='absolute top-[64px] m-auto justify-center font-bold left-0 right-0'>15 Times</span>}
                        {element.id === 5 && <span className='absolute top-[64px] m-auto justify-center font-bold left-0 right-0'>25 Times</span>}
                        {element.id === 6 && <span className='absolute top-[64px] m-auto justify-center font-bold left-0 right-0'>45 Times</span>}
                    </button>
                );
            })}
        </div>
    );
};
