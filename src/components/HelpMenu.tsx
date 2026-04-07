import ModalHeaderPlate from "./ModalHeaderPlate";
import { useGame } from "../hooks/useGameHook";

type HelpMenuProps = {
    onCloseHelp: () => void;
};

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

export default function HelpMenu({ onCloseHelp }: HelpMenuProps) {

    const { gameDetails } = useGame();
    return (
        <div className="h-[342px] bg-gradient-to-t from-[#7C00D5] to-[#5028C1] w-[393px] rounded-t-[20px]">
            <ModalHeaderPlate className="absolute left-1/2 -translate-x-1/2" />
            <span className="absolute  left-1/2 transform -translate-x-1/2 text-sm font-bold mt-1">how to play</span>
            <button className="absolute h-[19px] w-[19px] mt-[5px] pl-[2px] right-[62px] rounded-full bg-[#360149]" onClick={onCloseHelp}>
                <CloseIcon />
            </button>
            <div className=" scrollbar-hidden overflow-y-auto overflow-x-hidden flex pt-[52px] pl-[45px] pr-[39px]">
                <span>{gameDetails?.how_to_play?.rules}</span>
            </div>
        </div>
    )
}
