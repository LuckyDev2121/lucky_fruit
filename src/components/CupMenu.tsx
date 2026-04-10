import { useState } from "react";
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";
import { useGame, resolveAssetUrl } from "../hooks/useGameHook";
import ModalHeaderPlate from "./ModalHeaderPlate";
import RankingHelpModal from "./RankingHelpModal";

type CupMenuProps = {
    onCloseCup: () => void;
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

export default function CupMenu({ onCloseCup }: CupMenuProps) {
    const [isRankingHelpOpen, setIsRankingHelpOpen] = useState(false);

    const { rankingToday } = useGame();

    const getRankIcon = (index: number) => {
        if (index === 0) {
            return GAME_ASSETS.resultfirstposition;
        }
        if (index === 1) {
            return GAME_ASSETS.resultsecondposition;
        }
        if (index === 2) {
            return GAME_ASSETS.resultthirdposition;
        }

        return null;
    };

    return (
        <div className="h-[342px] bg-gradient-to-t from-[#7C00D5] to-[#5028C1] w-[393px] rounded-t-[20px]">
            <ModalHeaderPlate className="absolute left-1/2 -translate-x-1/2" />
            <span className="absolute  left-1/2 transform -translate-x-1/2 text-sm font-bold mt-1">Ranking today</span>
            <button className="absolute h-[19px] w-[19px] mt-[5px] pl-[2px] right-[62px] rounded-full bg-[#360149]" onClick={onCloseCup}>
                <CloseIcon />
            </button>
            <button className="absolute h-[19px] w-[19px] mt-[5px] pl-[2px] right-[87px] rounded-full bg-[#360149]" onClick={() => setIsRankingHelpOpen(true)}>
                <QuestionMarkIcon />
            </button>
            <div className="scrollbar-hidden absolute top-[30px] h-[312px] w-[393px] overflow-y-auto overflow-x-hidden pt-[15px]">
                {rankingToday.map((item, index) => {
                    const rankIcon = getRankIcon(index);
                    return (
                        <div key={`${item.player_id}-${index}`} className="relative flex h-[40px] w-[393px]">
                            {rankIcon ? (
                                <img
                                    src={getAssetUrl(rankIcon)}
                                    alt={`Rank ${index + 1}`}
                                    className="absolute my-[2px] ml-[23px] mr-[15px]"
                                />
                            ) : (
                                <span className="absolute inline-flex h-[36px] w-[36px] ml-[23px] mr-[15px] items-center justify-center">
                                    {index + 1}
                                </span>
                            )}
                            <img
                                src={resolveAssetUrl(item.player?.avater ?? "")}
                                alt={item.player?.username ?? "Player"}
                                className="absolute left-[74px] h-[36px] w-[36px] rounded-full object-cover"
                            />
                            <div className="absolute left-[123px] flex h-[40px] w-[198px] flex-col justify-center">
                                <span className="my-[2px] text-[20px] leading-none">{item.player?.username ?? "***"}</span>
                                <span className="my-[2px] text-[10px] leading-none">ID:{item.player?.id ?? "***"}</span>
                            </div>
                            <div className="absolute justify-between right-[22px] flex h-[22px] w-[105px] rounded-full bg-[#39064B]/70 my-[9px]">
                                <div className="relative ml-[5px] mr-[3px] mt-[6px] h-[9px] w-[16px]">
                                    <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" />
                                </div>
                                <span className="relative inline-flex items-center justify-center text-[12px] mr-[7px] ">
                                    {item.total_win}
                                </span>
                            </div>
                        </div>
                    );
                })}
            </div>
            {isRankingHelpOpen && (
                <>
                    <div className="absolute inset-0 z-[60] rounded-t-[20px] bg-black/30" />
                    <div className="absolute left-1/2 -top-[50px] z-[70] -translate-x-1/2 ">
                        <RankingHelpModal
                            onCloseRankingHelpModal={() => setIsRankingHelpOpen(false)}
                        />
                    </div>
                </>
            )}
        </div>
    )
}
