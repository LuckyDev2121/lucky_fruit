import dimond from "../assets/CoinBoard/dimond.svg";
import rectangle from "../assets/CoinBoard/Rectangle 4.svg";
import plus from "../assets/CoinBoard/Plus.svg";

type CoinBoardProps = {
  onOpenModal: (modal: string) => void;
};

export default function CoinBoard({ onOpenModal }: CoinBoardProps) {
  return (
    <div className="z-[530] flex items-center" style={{ height: "26px" }}>
      <div className="flex items-center relative" style={{ width: "107px", height: "26px" }}>
        <img src={rectangle} className="z-10 absolute inset-0 h-full w-full object-fill" />
        <div className="flex z-20 w-full">
          <img src={dimond} className="ml-[9px]" />
          <span className="ml-2.5  font-bold">129454</span>
          <button className="ml-auto mr-[7px]"
            onClick={() => onOpenModal("recharge")}>
            <img src={plus} />
          </button>
        </div>
      </div>
    </div>
  )
}