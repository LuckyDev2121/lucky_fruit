import { useEffect } from "react";
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";
// import { usePlayerDetails } from "../hooks/usePlayerDetails";
import { useGame } from "../hooks/useGameHook";
import CoinBoardPlate from "./CoinBoardPlate";

type CoinBoardProps = {
  onOpenModal: (modal: string) => void;
};

export default function CoinBoard({ onOpenModal }: CoinBoardProps) {
  const { playerInfo, displayBalance } = useGame();

  useEffect(() => {
    if (playerInfo?.avater) {
      const img = new Image();
      img.src = playerInfo?.avater;
    }
  }, [playerInfo?.avater]);

  return (
    <div className="z-[530] flex items-center" style={{ height: "26px" }}>
      <div className="flex items-center relative" style={{ width: "107px", height: "26px" }}>
        <CoinBoardPlate className="z-10 absolute inset-0 h-full w-full" />
        <div className="relative z-20 flex w-full items-center">
          <div className="ml-[9px] justify-center items-center flex">
            <img src={getAssetUrl(GAME_ASSETS.diamondIcon)} alt="Diamond Icon" />
          </div>
          <span className="pointer-events-none absolute ml-[10px] inset-0 flex items-center justify-center font-bold">
            {displayBalance}
          </span>
          <button className="ml-auto mr-[7px]"
            onClick={() => onOpenModal("recharge")}>
            <span>+</span>
          </button>
        </div>
      </div>
    </div>
  )
}
