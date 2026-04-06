import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";
import ModalHeaderPlate from "./ModalHeaderPlate";

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

export default function CupMenu({ onCloseCup, onOpenModal }: CupMenuProps) {
    return (
        <div className="h-[342px] bg-gradient-to-t from-[#7C00D5] to-[#5028C1] w-[393px] rounded-t-[20px]">
            <ModalHeaderPlate className="absolute left-1/2 -translate-x-1/2" />
            <span className="absolute  left-1/2 transform -translate-x-1/2 text-sm font-bold mt-1">Ranking today</span>
            <button className="absolute h-[19px] w-[19px] mt-[5px] pl-[2px] right-[62px] rounded-full bg-[#360149]" onClick={onCloseCup}>
                <CloseIcon />
            </button>
            <button className="absolute h-[19px] w-[19px] mt-[5px] pl-[2px] right-[87px] rounded-full bg-[#360149]" onClick={() => onOpenModal("help")}>
                <QuestionMarkIcon />
            </button>
            <div className="scrollbar-hidden absolute top-[30px] h-[312px] w-[393px] overflow-y-auto overflow-x-hidden pt-[15px]">
                <div className="relative flex h-[40px] w-[393px]">
                    <img src={getAssetUrl(GAME_ASSETS.resultfirstposition)} alt="First" className="absolute my-[2px] ml-[23px] mr-[15px] " />
                    {/* <img src={ } alt="Avatar" className="absolute left-[74px] h-[36px] w-[36px]" /> */}
                    <div className="absolute left-[123px] flex h-[40px] w-[198px] flex-col justify-center">
                        <span className="text-[20px] leading-none my-[2px]">Name: C</span>
                        <span className="text-[10px] leading-none my-[2px]">ID:234</span>
                    </div>
                    <div className="absolute flex bg-[#39064B]/70 h-[22px] w-[55px] right-[22px] rounded-full my-[9px]">
                        <div className="relative ml-[5px] mr-[3px] mt-[6px] h-[9px] w-[16px]">
                            <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" />
                        </div>
                        <span className="relative inline-flex text-[12px] my-[2px] items-center justify-center">****</span>
                    </div>
                </div>
                <div className="relative flex h-[40px] w-[393px]">
                    <img src={getAssetUrl(GAME_ASSETS.resultsecondposition)} alt="Second" className="absolute my-[2px] ml-[23px] mr-[15px] " />
                    {/* <img src={ } alt="Avatar" className="absolute left-[74px] h-[36px] w-[36px]" /> */}
                    <div className="absolute left-[123px] flex h-[40px] w-[198px] flex-col justify-center">
                        <span className="text-[20px] leading-none my-[2px]">Name: D</span>
                        <span className="text-[10px] leading-none my-[2px]">ID:235</span>
                    </div>
                    <div className="absolute flex bg-[#39064B]/70 h-[22px] w-[55px] right-[22px] rounded-full my-[9px]">
                        <div className="relative ml-[5px] mr-[3px] mt-[6px] h-[9px] w-[16px]">
                            <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" />
                        </div>
                        <span className="relative inline-flex text-[12px] my-[2px] items-center justify-center">****</span>
                    </div>
                </div>
                <div className="relative flex h-[40px] w-[393px]">
                    <img src={getAssetUrl(GAME_ASSETS.resultthirdposition)} alt="Third" className="absolute my-[2px] ml-[23px] mr-[15px] " />
                    {/* <img src={ } alt="Avatar" className="absolute left-[74px] h-[36px] w-[36px]" /> */}
                    <div className="absolute left-[123px] flex h-[40px] w-[198px] flex-col justify-center">
                        <span className="text-[20px] leading-none my-[2px]">Name: D</span>
                        <span className="text-[10px] leading-none my-[2px]">ID:235</span>
                    </div>
                    <div className="absolute flex bg-[#39064B]/70 h-[22px] w-[55px] right-[22px] rounded-full my-[9px]">
                        <div className="relative ml-[5px] mr-[3px] mt-[6px] h-[9px] w-[16px]">
                            <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" />
                        </div>
                        <span className="relative inline-flex text-[12px] my-[2px] items-center justify-center">****</span>
                    </div>
                </div>
                {Array.from({ length: 7 }).map((_, index) => (
                    <div key={index} className="relative flex h-[40px] w-[393px]">
                        <span className=" absolute inline-flex h-[36px] w-[36px] ml-[23px] mr-[15px]  items-center justify-center">{index + 4}</span>
                        {/* <img src={ } alt="Avatar" className="absolute left-[74px] h-[36px] w-[36px]" /> */}
                        <div className="absolute left-[123px] flex h-[40px] w-[198px] flex-col justify-center">
                            <span className="text-[20px] leading-none my-[2px]">Name: {String.fromCharCode(65 + index + 3)}</span>
                            <span className="text-[10px] leading-none my-[2px]">ID: {234 + index + 3}</span>
                        </div>
                        <div className="absolute flex bg-[#39064B]/70 h-[22px] w-[55px] right-[22px] rounded-full my-[9px]">
                            <div className="relative ml-[5px] mr-[3px] mt-[6px] h-[9px] w-[16px]">
                                <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" />
                            </div>
                            <span className="relative inline-flex text-[12px] my-[2px] items-center justify-center">****</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
