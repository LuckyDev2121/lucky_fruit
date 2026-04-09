import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useGame } from "../hooks/useGameHook";
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
  onToggleSound,
  isSoundPlaying,
  onOpenResultMenu,
  onCloseResultMenu,
  TodaysRoundId,
  isRoundRunning,
  onRoundFinished,
}: {
  onToggleMusic: () => void;
  isMusicPlaying: boolean;
  onToggleSound: () => void;
  isSoundPlaying: boolean;
  onOpenResultMenu: () => void;
  onCloseResultMenu: () => void;
  TodaysRoundId: number | null;
  isRoundRunning: boolean;
  onRoundFinished: () => void;
}) {

  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [activeAlert, setActiveAlert] = useState<string | null>(null);
  const [repeatRequestId, setRepeatRequestId] = useState(0);
  const [skipNextRepeatModal, setSkipNextRepeatModal] = useState(false);
  const [scale, setScale] = useState(1);
  const { displayBalance, previousRoundBets } = useGame();
  const isOverlayOpen = activeModal !== null || activeAlert !== null;
  const previousRoundTotal = Object.values(previousRoundBets).reduce((sum, amount) => sum + amount, 0);
  const availableBalance = Number.parseFloat(displayBalance ?? "0");
  const hasInsufficientBalance = previousRoundTotal > availableBalance;

  const triggerRepeatBet = () => {
    setRepeatRequestId((prev) => prev + 1);
  };

  const handleRepeatButtonClick = () => {
    if (skipNextRepeatModal) {
      triggerRepeatBet();
      return;
    }

    setActiveAlert("repeat");
  };

  const handleConfirmRepeat = () => {
    if (hasInsufficientBalance || previousRoundTotal <= 0) {
      return;
    }

    setActiveAlert(null);
    triggerRepeatBet();
  };

  useEffect(() => {
    if (activeModal === "result") {
      onOpenResultMenu();
    } else {
      onCloseResultMenu();
    }
  }, [activeModal]);

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
              RoundId={TodaysRoundId}
              isRoundRunning={isRoundRunning}
              onRoundFinished={onRoundFinished}
              onOpenModal={(modal) => setActiveModal(modal)}
              onRepeatButtonClick={handleRepeatButtonClick}
              repeatRequestId={repeatRequestId}
            />
          </div>

          <AnimatePresence>
            {isOverlayOpen && (
              <motion.div
                key="modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.25 }}
                className="absolute inset-0 z-40 rounded-t-[20px] bg-black/60"
              />
            )}

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
                    start={3}
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
                    <RepeatModal
                      onCloseRepeatModal={() => setActiveAlert(null)}
                      onConfirmRepeat={handleConfirmRepeat}
                      previousRoundTotal={previousRoundTotal}
                      skipNextRepeatModal={skipNextRepeatModal}
                      onSkipNextRepeatModalChange={setSkipNextRepeatModal}
                      hasInsufficientBalance={hasInsufficientBalance}
                    />
                  )
                }
                {activeAlert === "music" && (
                  <MusicModal
                    isMusicPlaying={isMusicPlaying}
                    isSoundPlaying={isSoundPlaying}
                    onToggleMusic={onToggleMusic}
                    onToggleSound={onToggleSound}
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
