import dimond from "../assets/CoinBoard/dimond.svg"
import Checkbox from "./CheckBox";

type RepeatModalProps = {
    onCloseRepeatModal: () => void;
};

export default function RepeatModal({ onCloseRepeatModal }: RepeatModalProps) {
    return (
        <div className="relative h-[245px] w-[340px]  bg-gradient-to-t from-[#6D1F92] to-[#B935F8]  rounded-[32px]">
            <span className="absolute top-[23px] flew px-[39px] text-center text-[15px] font-bold">Are you sure to repeat the previous round of betting?</span>
            <div className="absolute top-[73px] flex z-20 w-full left-1/2 transform -translate-x-1/2 items-center justify-center">
                <img src={dimond} className="ml-[9px]" />
                <span className="ml-2.5  font-bold">1111111</span>
            </div>
            <div className="absolute top-[106px] flex z-20 w-full left-1/2 transform -translate-x-1/2 items-center justify-center">
                <Checkbox label="Don't show next time" />
            </div>
            {/* <span className="absolute  left-1/2 transform -translate-x-1/2 font-bold">Are you sure to repeat the previous round of betting?</span> */}
            <button className="absolute w-[191px] h-[38px] rounded-[6px] top-[136px] left-1/2 transform -translate-x-1/2 bg-gradient-to-t from-[#b87036] via-[#fcc024] via-[#fdd03c] to-[#fdf3ba]  text-[#A04800] font-bold"
                onClick={() => console.log("Confirm clicked")}>
                Confirm
            </button>
            <button className="absolute w-[191px] h-[38px] rounded-[6px] top-[182px] left-1/2 transform -translate-x-1/2 bg-gradient-to-t from-[#891ac1] via-[#ca7afd] via-[#d494f4] to-[#fdf3ba]  text-[#27598e] font-bold"
                onClick={onCloseRepeatModal}>
                Cancel
            </button>
        </div>
    )
}