import CoinBoard from "./CoinBoard";
import TopMenu from "./TopMenu";
import PlayBoard from "./PlayBoard";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import HelpMenu from "./HelpMenu";
import NoteMenu from "./NoteMenu";
import CupMenu from "./CupMenu";
import ResultMenu from "./ResultMenu";
// import { div } from "framer-motion/client";

export default function LuckyFruitGame() {

  const [activeModal, setActiveModal] = useState<string | null>(null);
  return (
    <div className="w-screen h-screen relative bg-[#A91FE6]  max-w-[393px] max-h-[533px]">
      <div className="flex justify-between">
        <div className=" ml-[13px] mt-[11px]">
          <CoinBoard />
        </div>
        <div className="ml-auto mr-4 mt-2.5">
          <TopMenu onOpenModal={(modal) => setActiveModal(modal)} />
        </div>
      </div>
      <div className="bottom-0 left-0 right-0">
        <PlayBoard onOpenModal={(modal) => setActiveModal(modal)} />
      </div>
      <AnimatePresence>
        {activeModal && (
          <motion.div
            key={activeModal}
            initial={{ y: 533, opacity: 0 }}   // start 100px lower
            animate={{ y: 149, opacity: 1 }}     // move up to normal position
            exit={{ y: 533, opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute z-50  h-[342px] w-[393px]"
          >
            {activeModal === "help" && (
              <HelpMenu onCloseHelp={() => setActiveModal(null)} />
            )}
            {activeModal === "music" && (
              <div></div>
            )}
            {activeModal === "note" && (
              <NoteMenu onCloseNote={() => setActiveModal(null)} onOpenModal={setActiveModal} />
            )}
            {activeModal === "cup" && (
              <CupMenu onCloseCup={() => setActiveModal(null)} onOpenModal={setActiveModal} />
            )}
            {activeModal === "result" && (
              <ResultMenu start={5} onResultTimeUp={() => {
                setActiveModal(null)
              }} />
            )}
          </motion.div >
        )}
      </AnimatePresence>
    </div>
  )
}