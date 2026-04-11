import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";
import ModalHeaderPlate from "./ModalHeaderPlate";
import { useGame, resolveAssetUrl } from "../hooks/useGameHook";

type NoteMenuProps = {
    onCloseNote: () => void;
    onOpenModal: (modal: string) => void;
};

function QuestionMarkIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path
                d="M5.55 5.4C5.55 4.35 6.4 3.5 7.45 3.5C8.5 3.5 9.35 4.25 9.35 5.2C9.35 5.95 8.95 6.45 8.25 6.9C7.6 7.3 7.2 7.7 7.2 8.45V8.7"
                stroke="white"
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <circle cx="7.2" cy="11.1" r="0.8" fill="white" />
        </svg>
    );
}

function CloseIcon() {
    return (
        <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
            <path
                d="M4.2 4.2L10.8 10.8"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
            <path
                d="M10.8 4.2L4.2 10.8"
                stroke="white"
                strokeWidth="1.4"
                strokeLinecap="round"
            />
        </svg>
    );
}

export default function NoteMenu({ onCloseNote, onOpenModal }: NoteMenuProps) {


    const { options, playerLog, winToday } = useGame();


    return (
        <div className="h-[342px] bg-gradient-to-t from-[#7C00D5] to-[#5028C1] w-[393px] rounded-t-[20px]">
            <ModalHeaderPlate className="absolute left-1/2 -translate-x-1/2" />
            <span className="absolute  left-1/2 transform -translate-x-1/2 text-sm font-bold mt-1">Record (ID:1638)</span>
            <button className="absolute h-[19px] w-[19px] mt-[5px] pl-[2px] right-[62px] rounded-full bg-[#360149]" onClick={onCloseNote}>
                <CloseIcon />
            </button>
            <button className="absolute h-[19px] w-[19px] mt-[5px] pl-[2px] right-[87px] rounded-full bg-[#360149]" onClick={() => onOpenModal("help")}>
                <QuestionMarkIcon />
            </button>
            <div className="scrollbar-hidden absolute top-[57px] left-1/2 transform -translate-x-1/2 w-[84%] h-[60%] grid gap-1 overflow-x-hidden overflow-y-auto">
                <div className="relative p-5 h-fit bg-[#450371] rounded-[12px] justify-between items-center flex" >
                    <span>Win Today</span>
                    <div>
                        <div className="ml-[9px] justify-center items-center flex">
                            <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" className="h-[9px] w-[16px] mr-[3px]" />
                            <span className="ml-2.5 font-bold">{winToday?.win}</span>
                        </div>
                    </div>
                </div>
                {playerLog.map((item, index) => {
                    return (
                        <div className="relative px-3 pt-2 pb-5 h-fit bg-[#450371] rounded-[12px] ">
                            <div className="justify-between items-center  flex">
                                <span className="text-[10px] text-[#FFFFF]-600 ">Round {item.round_id}</span>
                                <span className="text-[10px] text-[#FFFFF]-600 ">{item.created_at}</span>
                            </div>
                            <div className="justify-between items-center flex">
                                <span>Winning
                                    {/* <img src={getAssetUrl(logo)} alt="a" /> */}
                                </span>
                                <span>Lose</span>
                            </div>
                            <span>Mine</span>
                            <div className="grid grid-cols-4 grid-rows-2 gap-1">
                                {options.map((element) => {
                                    return (
                                        <div className="justify-center items-center flex " >
                                            <img src={getAssetUrl(element.logo)} alt={element.name} className="h-4 w-4 mr-[2px]" />
                                            <div className=" justify-center items-center content-center h-[14px] w-[10px]">
                                                <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" className="h-[9px] w-[16px] mr-[3px]" />
                                            </div>
                                            <span>{item.amount}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}
