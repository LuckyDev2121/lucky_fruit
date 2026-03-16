import CoinBoard from "./CoinBoard";
import TopMenu from "./TopMenu";
import PlayBoard from "./PlayBoard";

export default function LuckyFruitGame() {
  return (
    <div className="w-screen h-screen relative bg-[#A91FE6]">
      <div className="flex justify-between">
        <div className="ml-[13px] mt-[11px]">
          <CoinBoard />
        </div>
        <div className="ml-auto mr-4 mt-2.5">
          <TopMenu />
        </div>
      </div>
      <div className=" bottom-0 left-0 right-0">
        <PlayBoard />
      </div>
    </div>
  )
}