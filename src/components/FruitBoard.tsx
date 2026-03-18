import cherry from "../assets/fruits/cherry.svg"
import grape from "../assets/fruits/grapes.svg"
import lemon from "../assets/fruits/lemon.svg"
import orange from "../assets/fruits/orange.svg"
import strawberry from "../assets/fruits/strawberry.svg"
import watermelon from "../assets/fruits/watermelon.svg"
import tomato from "../assets/fruits/tomato.svg"
import kiwi from "../assets/fruits/kiwi.svg"

const fruits = [
    { id: 26, element_name: "Kiwi", element_icon: kiwi },
    { id: 27, element_name: "Orange", element_icon: orange },
    { id: 28, element_name: "Lemon", element_icon: lemon },
    { id: 29, element_name: "Cherry", element_icon: cherry },
    { id: 30, element_name: "Strawberry", element_icon: strawberry },
    { id: 31, element_name: "Grape", element_icon: grape },
    { id: 32, element_name: "Watermelon", element_icon: watermelon },
    { id: 33, element_name: "Tomato", element_icon: tomato }
];


export default function FruitBoard() {

    return (
        <div className='relative top-[90px] h-[271px] w-[280px] z-30 grid grid-cols-3 grid-rows-3 left-1/2 transform -translate-x-1/2' style={{ pointerEvents: 'auto' }}>
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

                        {(element.id === 33 || element.id === 26 || element.id === 27 || element.id === 28) && (
                            <span className='absolute top-[64px] m-auto justify-center font-bold left-0 right-0'>5 Times</span>
                        )}
                        {element.id === 29 && <span className='absolute top-[64px] m-auto justify-center font-bold left-0 right-0'>10 Times</span>}
                        {element.id === 30 && <span className='absolute top-[64px] m-auto justify-center font-bold left-0 right-0'>15 Times</span>}
                        {element.id === 31 && <span className='absolute top-[64px] m-auto justify-center font-bold left-0 right-0'>25 Times</span>}
                        {element.id === 32 && <span className='absolute top-[64px] m-auto justify-center font-bold left-0 right-0'>40 Times</span>}
                    </button>
                );
            })}
        </div>
    );
};
