import rectangle from "../assets/Modal/Rectangle.svg"
import close from "../assets/TopMenu/X.svg";
import help from "../assets/TopMenu/QuestionMark.svg";
import abatar from "../assets/Modal/abatar.svg";
// import first from "../assets/Modal/result-1st-postion.svg";
// import second from "../assets/Modal/result-2nd-postion.svg";
// import third from "../assets/Modal/result-3rd-postion.svg";
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";

type CupMenuProps = {
    onCloseCup: () => void;
    onOpenModal: (modal: string) => void;
};

export default function CupMenu({ onCloseCup, onOpenModal }: CupMenuProps) {
    return (
        <div className="h-[342px] bg-gradient-to-t from-[#7C00D5] to-[#5028C1] w-[393px] rounded-t-[20px]">
            <img src={rectangle} alt="Rectangle" className="absolute left-1/2 transform -translate-x-1/2" />
            <span className="absolute  left-1/2 transform -translate-x-1/2 text-sm font-bold mt-1">Ranking today</span>
            <button className="absolute h-[19px] w-[19px] mt-[5px] right-[62px] rounded-full bg-[#360149]" onClick={onCloseCup}>
                <img src={close} alt="Close" className="p-[3px]" />
            </button>
            <button className="absolute h-[19px] w-[19px] mt-[5px] right-[87px] rounded-full bg-[#360149]" onClick={() => onOpenModal("help")}>
                <img src={help} alt="Help" className="p-[3px]" />
            </button>
            <div className="absolute top-[30px] h-[312px] w-[393px] overflow-y-auto overflow-x-hidden pt-[15px]">
                <div className="relative flex h-[40px] w-[393px]">
                    <img src={getAssetUrl(GAME_ASSETS.resultfirstposition)} alt="First" className="absolute my-[2px] ml-[23px] mr-[15px] " />
                    <img src={abatar} alt="Avatar" className="absolute left-[74px] h-[36px] w-[36px]" />
                    <div className="absolute left-[123px] flex h-[40px] w-[198px] flex-col justify-center">
                        <span className="text-[20px] leading-none my-[2px]">Name: C</span>
                        <span className="text-[10px] leading-none my-[2px]">ID:234</span>
                    </div>
                    <div className="absolute flex bg-[#39064B]/70 h-[22px] w-[55px] right-[22px] rounded-full my-[9px]">
                        <div className="relative ml-[5px] mr-[3px] mt-[2px] h-[9px] w-[16px]">
                            <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" />
                        </div>
                        <span className="relative inline-flex text-[12px] my-[2px] items-center justify-center">****</span>
                    </div>
                </div>
                <div className="relative flex h-[40px] w-[393px]">
                    <img src={getAssetUrl(GAME_ASSETS.resultsecondposition)} alt="Second" className="absolute my-[2px] ml-[23px] mr-[15px] " />
                    <img src={abatar} alt="Avatar" className="absolute left-[74px] h-[36px] w-[36px]" />
                    <div className="absolute left-[123px] flex h-[40px] w-[198px] flex-col justify-center">
                        <span className="text-[20px] leading-none my-[2px]">Name: D</span>
                        <span className="text-[10px] leading-none my-[2px]">ID:235</span>
                    </div>
                    <div className="absolute flex bg-[#39064B]/70 h-[22px] w-[55px] right-[22px] rounded-full my-[9px]">
                        <div className="relative ml-[5px] mr-[3px] mt-[2px] h-[9px] w-[16px]">
                            <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" />
                        </div>
                        <span className="relative inline-flex text-[12px] my-[2px] items-center justify-center">****</span>
                    </div>
                </div>
                <div className="relative flex h-[40px] w-[393px]">
                    <img src={getAssetUrl(GAME_ASSETS.resultthirdposition)} alt="Third" className="absolute my-[2px] ml-[23px] mr-[15px] " />
                    <img src={abatar} alt="Avatar" className="absolute left-[74px] h-[36px] w-[36px]" />
                    <div className="absolute left-[123px] flex h-[40px] w-[198px] flex-col justify-center">
                        <span className="text-[20px] leading-none my-[2px]">Name: D</span>
                        <span className="text-[10px] leading-none my-[2px]">ID:235</span>
                    </div>
                    <div className="absolute flex bg-[#39064B]/70 h-[22px] w-[55px] right-[22px] rounded-full my-[9px]">
                        <div className="relative ml-[5px] mr-[3px] mt-[2px] h-[9px] w-[16px]">
                            <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" />
                        </div>
                        <span className="relative inline-flex text-[12px] my-[2px] items-center justify-center">****</span>
                    </div>
                </div>
                {Array.from({ length: 7 }).map((_, index) => (
                    <div key={index} className="relative flex h-[40px] w-[393px]">
                        <span className=" absolute inline-flex h-[36px] w-[36px] ml-[23px] mr-[15px]  items-center justify-center">{index + 4}</span>
                        <img src={abatar} alt="Avatar" className="absolute left-[74px] h-[36px] w-[36px]" />
                        <div className="absolute left-[123px] flex h-[40px] w-[198px] flex-col justify-center">
                            <span className="text-[20px] leading-none my-[2px]">Name: {String.fromCharCode(65 + index + 3)}</span>
                            <span className="text-[10px] leading-none my-[2px]">ID: {234 + index + 3}</span>
                        </div>
                        <div className="absolute flex bg-[#39064B]/70 h-[22px] w-[55px] right-[22px] rounded-full my-[9px]">
                            <div className="relative ml-[5px] mr-[3px] mt-[2px] h-[9px] w-[16px]">
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
