import rectangle from "../assets/Modal/Rectangle.svg"
import close from "../assets/TopMenu/X.svg";

type HelpMenuProps = {
    onCloseHelp: () => void;
};

export default function HelpMenu({ onCloseHelp }: HelpMenuProps) {
    return (
        <div className="h-[342px] bg-gradient-to-t from-[#7C00D5] to-[#5028C1] w-[393px] rounded-t-[20px]">
            <img src={rectangle} alt="Rectangle" className="absolute left-1/2 transform -translate-x-1/2" />
            <span className="absolute  left-1/2 transform -translate-x-1/2 text-sm font-bold mt-1">how to play</span>
            <button className="absolute h-[19px] w-[19px] mt-[5px] right-[62px] rounded-full bg-[#360149]" onClick={onCloseHelp}>
                <img src={close} alt="Close" className="p-[3px]" />
            </button>
            <div className="flex flex-col gap-[14px] pt-[52px] pl-[45px] pr-[39px]">
                <span >1. Select the number of diamonds, then select the fruits</span>
                <span >2. You can choose up to 6 kinds of fruits in each round, and  there is no upper limit on the cost of each fruit</span>
                <span >3. If the selected fruit wins, you will get the corresponding reward</span>
                <span >4. The interpretation right of this game belongs to Hilo</span>
            </div>
        </div>
    )
}