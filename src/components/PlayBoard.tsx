import playboard from "../assets/PlayBoard/playboard.svg";
import fruitboard from "../assets/PlayBoard/fruitboard.svg";
import luckyfruit from "../assets/PlayBoard/luckyfruit.svg";
import timer from "../assets/PlayBoard/timer.svg";
import repeat from "../assets/PlayBoard/repeat.svg";
import lvl1 from "../assets/BetBoard/100.svg"
import lvl2 from "../assets/BetBoard/1000.svg"
import lvl3 from "../assets/BetBoard/1000.svg"
import lvl4 from "../assets/BetBoard/100K.svg"
import lvl5 from "../assets/BetBoard/1M.svg"
import bottomboard from "../assets/BottomBoard/bottomboard.svg"

export default function PlayBoard() {
    return (
        <div className="pointer-events-none absolute z-20 object-contain" style={{ width: "100%", height: "auto" }}>
            <div className=" relative z-20 inset-0">
                <img src={luckyfruit} alt="luckyfruit" className="absolute top-[20px] inset-0 z-20 left-1/2 transform -translate-x-1/2" />
                <img src={playboard} className=" absolute inset-0" />
                <span className="absolute justify-center font-regular top-[69px] w-[124px] h-[18px] text-center left-1/2 transform -translate-x-1/2 rounded-full bg-[#3D005C] ">Round 1526 of today</span>
                <img src={fruitboard} className=" absolute top-[90px] z-20 left-1/2 transform -translate-x-1/2" />
                <img src={timer} className="absolute top-[183px] z-20 left-1/2 transform -translate-x-1/2" />
                <img src={repeat} className="absolute top-[320px] z-20 left-[calc(78%-0px)]" />
                <div className="absolute inset-0 top-[361px] z-20 flex justify-center">
                    <button className="relative">
                        <img src={lvl1} alt="Level 1" className="relative" />
                    </button>
                    <button className="relative">
                        <img src={lvl2} alt="Level 2" className="relative" />
                    </button>
                    <button className="relative">
                        <img src={lvl3} alt="Level 3" className="relative" />
                    </button>
                    <button className="relative">
                        <img src={lvl4} alt="Level 4" className="relative" />
                    </button>
                    <button className="relative">
                        <img src={lvl5} alt="Level 5" className="relative" />
                    </button>
                </div>
                <img src={bottomboard} className=" absolute top-[442px] left-1/2 transform -translate-x-1/2 z-20" />
            </div>
        </div >
    )
}