import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import CoinBoard from "./CoinBoard";
import CupMenu from "./CupMenu";
import HelpMenu from "./HelpMenu";
import NoteMenu from "./NoteMenu";
import PlayBoard from "./PlayBoard";
import RechargeMenu from "./RechargeMenu";
import RepeatModal from "./RepeatModal";
import MusicModal from "./MusicModal";
import ResultMenu from "./ResultMenu";
import TopMenu from "./TopMenu";

const GAME_WIDTH = 393;
const GAME_HEIGHT = 533;

export default function LuckyFruitGame({
  onToggleMusic,
  isMusicPlaying,
}: {
  onToggleMusic: () => void;
  isMusicPlaying: boolean;
}) {
  const [resultFruit, setResultFruit] = useState<string | null>(null);
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const updateScale = () => {
      const nextScale = Math.min(
        window.innerWidth / GAME_WIDTH,
        window.innerHeight / GAME_HEIGHT
      );

      setScale(nextScale > 0 ? nextScale : 1);
    };

    updateScale();
    window.addEventListener("resize", updateScale);

    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div className="fixed inset-0 flex items-end justify-center overflow-hidden ">
      <div
        className="relative"
        style={{
          width: `${GAME_WIDTH * scale}px`,
          height: `${GAME_HEIGHT * scale}px`,
        }}
      >
        <div
          className="absolute left-0 top-0 origin-top-left rounded-t-[20px] bg-[#A91FE6]"
          style={{
            width: `${GAME_WIDTH}px`,
            height: `${GAME_HEIGHT}px`,
            transform: `scale(${scale})`,
          }}
        >
          <div className="flex justify-between">
            <div className="ml-[13px] mt-[11px]">
              <CoinBoard onOpenModal={(modal) => setActiveModal(modal)} />
            </div>
            <div className="ml-auto mr-4 mt-2.5">
              <TopMenu
                onOpenModal={(modal) => setActiveModal(modal)}
                onOpenAlert={(alert) => setActiveAlert(alert)}
              />
            </div>
          </div>

          <div className="bottom-0 left-0 right-0">
            <PlayBoard
              onOpenModal={(modal) => setActiveModal(modal)}
              onOpenAlert={(alert) => setActiveAlert(alert)}
              onResult={(fruit) => setResultFruit(fruit)}
            />
          </div>

          <AnimatePresence>
            {activeModal && activeModal !== "recharge" && (
              <motion.div
                key={activeModal}
                initial={{ y: GAME_HEIGHT, opacity: 0 }}
                animate={{ y: 149, opacity: 1 }}
                exit={{ y: GAME_HEIGHT, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute z-50 h-[342px] w-[393px]"
              >
                {activeModal === "help" && (
                  <HelpMenu onCloseHelp={() => setActiveModal(null)} />
                )}

                {activeModal === "note" && (
                  <NoteMenu
                    onCloseNote={() => setActiveModal(null)}
                    onOpenModal={setActiveModal}
                  />
                )}
                {activeModal === "cup" && (
                  <CupMenu
                    onCloseCup={() => setActiveModal(null)}
                    onOpenModal={setActiveModal}
                  />
                )}
                {activeModal === "result" && (
                  <ResultMenu
                    resultFruit={resultFruit}
                    start={5}
                    onResultTimeUp={() => {
                      setActiveModal(null);
                    }}
                  />
                )}
              </motion.div>
            )}

            {activeModal === "recharge" && (
              <motion.div
                key={activeModal}
                initial={{ y: GAME_HEIGHT, opacity: 0 }}
                animate={{ y: 345, opacity: 1 }}
                exit={{ y: GAME_HEIGHT, opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute z-50 h-[146px] w-[393px]"
              >
                <RechargeMenu onCloseRechargeModal={() => setActiveModal(null)} />
              </motion.div>
            )}

            {activeAlert && (
              <motion.div
                key={activeAlert}
                initial={{ transform: "translate(-50%, -50%)", opacity: 0 }}
                animate={{ transform: "translate(-50%, -50%)", opacity: 1 }}
                exit={{ transform: "translate(-50%, -50%)", opacity: 0 }}
                transition={{ duration: 0.4 }}
                className="absolute left-1/2 top-1/2 z-50"
              >
                {
                  activeAlert === "repeat" && (
                    <RepeatModal onCloseRepeatModal={() => setActiveAlert(null)} />
                  )
                }
                {activeAlert === "music" && (
                  <MusicModal
                    isMusicPlaying={isMusicPlaying}
                    isSoundEnabled={isSoundEnabled}
                    onToggleMusic={onToggleMusic}
                    onToggleSound={() => setIsSoundEnabled((prev) => !prev)}
                    onCloseMusicModal={() => setActiveAlert(null)}
                  />
                )}
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
