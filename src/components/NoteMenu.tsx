import rectangle from "../assets/Modal/Rectangle.svg"
import close from "../assets/TopMenu/X.svg";
import help from "../assets/TopMenu/QuestionMark.svg";
import CoinIcon from "./CoinIcon";
import cherry from "../assets/fruits/cherry.svg"
import grape from "../assets/fruits/grapes.svg"
import lemon from "../assets/fruits/lemon.svg"
import orange from "../assets/fruits/orange.svg"
import strawberry from "../assets/fruits/strawberry.svg"
import watermelon from "../assets/fruits/watermelon.svg"
import tomato from "../assets/fruits/tomato.svg"
import kiwi from "../assets/fruits/kiwi.svg"

type NoteMenuProps = {
    onCloseNote: () => void;
    onOpenModal: (modal: string) => void;
};

export default function NoteMenu({ onCloseNote, onOpenModal }: NoteMenuProps) {
    return (
        <div className="h-[342px] bg-gradient-to-t from-[#7C00D5] to-[#5028C1] w-[393px] rounded-t-[20px]">
            <img src={rectangle} alt="Rectangle" className="absolute left-1/2 transform -translate-x-1/2" />
            <span className="absolute  left-1/2 transform -translate-x-1/2 text-sm font-bold mt-1">Record (ID:1638)</span>
            <button className="absolute h-[19px] w-[19px] mt-[5px] right-[62px] rounded-full bg-[#360149]" onClick={onCloseNote}>
                <img src={close} alt="Close" className="p-[3px]" />
            </button>
            <button className="absolute h-[19px] w-[19px] mt-[5px] right-[87px] rounded-full bg-[#360149]" onClick={() => onOpenModal("help")}>
                <img src={help} alt="Help" className="p-[3px]" />
            </button>
            <div className="absolute top-[57px] left-1/2 transform -translate-x-1/2 w-[84%] h-[60%] grid gap-1">
                <div className="relative p-5 h-fit bg-[#450371] rounded-[12px] justify-between items-center flex" >
                    <span>Win Today</span>
                    <div>
                        <div className="ml-[9px] justify-center items-center flex">
                            <CoinIcon />
                            <span className="ml-2.5 font-bold">0</span>
                        </div>
                    </div>
                </div>
                <div className="relative px-3 pt-2 pb-5 h-fit bg-[#450371] rounded-[12px] ">
                    <div className="justify-between items-center  flex">
                        <span className="text-[10px] text-[#FFFFF]-600 ">Round 1406</span>
                        <span className="text-[10px] text-[#FFFFF]-600 ">2026-02-26 12:17:40</span>
                    </div>
                    <div className="justify-between items-center flex">
                        <span>Winning
                            {/* <img src="" alt="" /> */}
                        </span>
                        <span>Lose</span>
                    </div>
                    <span>Mine</span>
                    <div className="grid grid-cols-4 grid-rows-2 gap-1">
                        <div className="justify-center items-center flex ">
                            <img src={kiwi} alt="Kiwi" className="h-4 w-4 mr-[2px]" />
                            <div className=" justify-center items-center  ">
                                <CoinIcon />
                            </div>
                            <span>100000</span>
                        </div>
                        <div className="justify-center items-center flex ">
                            <img src={orange} alt="Orange" className="h-4 w-4 mr-[2px]" />
                            <div className="justify-center items-center ">
                                <CoinIcon />
                            </div>
                            <span>100000</span>
                        </div>
                        <div className="justify-center items-center flex ">
                            <img src={cherry} alt="Cherry" className="h-4 w-4 mr-[2px]" />
                            <div className="justify-center items-center ">
                                <CoinIcon />
                            </div>
                            <span>100000</span>
                        </div>
                        <div className="justify-center items-center flex ">
                            <img src={tomato} alt="Tomato" className="h-4 w-4 mr-[2px]" />
                            <div className="justify-center items-center ">
                                <CoinIcon />
                            </div>
                            <span>100000</span>
                        </div>
                        <div className="justify-center items-center flex ">
                            <img src={watermelon} alt="Watermelon" className="h-4 w-4 mr-[2px]" />
                            <div className="justify-center items-center ">
                                <CoinIcon />
                            </div>
                            <span>100000</span>
                        </div>
                        <div className="justify-center items-center flex ">
                            <img src={grape} alt="Grape" className="h-4 w-4 mr-[2px]" />
                            <div className="justify-center items-center flex">
                                <CoinIcon />
                            </div>
                            <span>100000</span>
                        </div>
                        <div className="justify-center items-center flex ">
                            <img src={strawberry} alt="Strawberry" className="h-4 w-4 mr-[2px]" />
                            <div className="justify-center items-center ">
                                <CoinIcon />
                            </div>
                            <span>100000</span>
                        </div>
                        <div className="justify-center items-center flex ">
                            <img src={lemon} alt="Lemon" className="h-4 w-4 mr-[2px]" />
                            <div className="justify-center items-center ">
                                <CoinIcon />
                            </div>
                            <span>100000</span>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    )
}