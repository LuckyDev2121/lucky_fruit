import { useEffect, useMemo, } from "react";
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";
import ModalHeaderPlate from "./ModalHeaderPlate";
import { useGame, } from "../hooks/useGameHook";
import { transformGameLog, } from "../utils/transformGameLog";

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
    const { options, playerLog, winToday, handlePlayerLog, handleWinToday } = useGame();

    useEffect(() => {
        const load = async () => {
            if (playerLog.length === 0) {
                await handlePlayerLog();
            }

            if (!winToday) {
                await handleWinToday();
            }
        };
        void load();
    }, [handlePlayerLog, handleWinToday, playerLog.length, winToday]);

    const rounds = useMemo(() => {
        return transformGameLog(playerLog);
    }, [playerLog]);

    const optionById = useMemo(() => {
        return new Map(options.map((option) => [option.id, option]));
    }, [options]);

    return (
        <div className="h-[342px] bg-gradient-to-t from-[#7C00D5] to-[#5028C1] w-[393px] rounded-t-[20px]">
            <ModalHeaderPlate className="absolute left-1/2 -translate-x-1/2" />
            <span className="absolute  left-1/2 transform -translate-x-1/2 text-sm font-bold mt-1">Record (ID:{winToday?.user_id})</span>
            <button className="absolute h-[19px] w-[19px] mt-[5px] pl-[2px] right-[62px] rounded-full bg-[#360149]" onClick={onCloseNote}>
                <CloseIcon />
            </button>
            <button className="absolute h-[19px] w-[19px] mt-[5px] pl-[2px] right-[87px] rounded-full bg-[#360149]" onClick={() => onOpenModal("help")}>
                <QuestionMarkIcon />
            </button>
            <div className="scrollbar-hidden absolute top-[57px] left-1/2 transform -translate-x-1/2 w-[84%] h-[70%] grip overflow-x-hidden overflow-y-auto">
                <div className="relative p-5 h-fit bg-[#450371] rounded-[12px] justify-between items-center flex" >
                    <span>Win Today</span>
                    <div>
                        <div className="ml-[9px] justify-center items-center flex">
                            <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" className="h-[9px] w-[16px] mr-[3px]" />
                            <span className="ml-2.5 font-bold">{winToday?.win}</span>
                        </div>
                    </div>
                </div>
                {rounds.map((item) => {
                    const result = new Date(new Date().getTime() - (39 * item.round_id) * 1000)
                    const formatDate = (date: Date) => {
                        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
                    };
                    const winningOption = item.winning_option_id[0]
                        ? optionById.get(item.winning_option_id[0])
                        : undefined;
                    return (
                        <div key={item.round_id} className="relative h-[134px] w-[324px] flex px-3 pt-2 pb-5  bg-[#450371] rounded-[12px] mt-[40px] ">
                            <div className="absolute w-[300px] flex justify-between">
                                <span className=" relative  text-[10px] text-[#FFFFFF]/60 ">Round {item.round_id}</span>
                                <span className=" relative   text-[10px] text-[#FFFFFF]/60  ">{formatDate(result)}</span>
                            </div>
                            <div className="absolute w-[300px] top-[30px] justify-between items-center flex">
                                <span className=" relative flex  items-center">Winning
                                    {item.winning_option_id.length === 1 && winningOption && (
                                        <img
                                            src={getAssetUrl(winningOption.logo)}
                                            alt="a"
                                            className="w-[20px] h-[20px] ml-[10px]"
                                        />
                                    )}
                                    {item.winning_option_id.length > 1 && item.winning_option_id[0] === 5 && (
                                        <img
                                            key={item.winning_option_id[0]}
                                            src={getAssetUrl("fruit-jackpot/small.svg")}
                                            alt="a"
                                            className="w-[20px] h-[20px] ml-[10px]"
                                        />
                                    )}
                                    {item.winning_option_id.length > 1 && item.winning_option_id[0] === 9 && (
                                        <img
                                            key={item.winning_option_id[0]}
                                            src={getAssetUrl("fruit-jackpot/big.svg")}
                                            alt="a"
                                            className="w-[20px] h-[20px] ml-[10px]"
                                        />
                                    )}
                                </span >
                                <span className=" relative   ">{item.status ? "WIN" : "LOSE"}</span>
                            </div>
                            <span className="absolute top-[54px]">Mine</span>
                            <div className="absolute top-[78px]  grid grid-cols-4 grid-rows-2 gap-[0px]">
                                {item.detail.map((element) => {
                                    const option = optionById.get(element.option_id);

                                    if (element.bet_amount && option) {
                                        return (
                                            <div key={element.option_id} className="relative w-[75px] h-[20px] justify-center items-center flex " >
                                                <img src={getAssetUrl(option.logo)} alt={option.name} className="h-4 w-4 mr-[2px]" />
                                                <div className=" justify-center items-center content-center h-[14px] w-[10px]">
                                                    <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" className="h-[9px] w-[16px] mr-[5px]" />
                                                </div>
                                                <span className=" items-center ml-[2px]">{element.bet_amount}</span>
                                            </div>
                                        );
                                    }
                                })}
                            </div>
                        </div>
                    )
                })}
            </div>
        </div >
    )
}
