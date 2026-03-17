import rectangle from "../assets/Modal/Rectangle.svg"
import close from "../assets/TopMenu/X.svg";
import help from "../assets/TopMenu/QuestionMark.svg";

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
        </div>
    )
}