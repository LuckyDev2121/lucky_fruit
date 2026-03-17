import MenuButton from "./MenuButton";

import note from "../assets/TopMenu/ClipboardText.svg";
import music from "../assets/TopMenu/MusicNotes.svg";
import help from "../assets/TopMenu/QuestionMark.svg";
import speaker from "../assets/TopMenu/SpeakerHigh.svg";
import close from "../assets/TopMenu/X.svg";
import cup from "../assets/TopMenu/cup.svg";

type TopMenuProps = {
  onOpenModal: (modal: string) => void;
};

const TopMenu: React.FC<TopMenuProps> = ({ onOpenModal }) => {
  return (
    <div className="flex gap-[5px]">
      <MenuButton
        icon={cup}
        background={"#773AC8"}
        onClick={() => onOpenModal("cup")}
      />

      <MenuButton
        icon={music}
        background={"#773AC8"}
        onClick={() => onOpenModal("music")}
      />

      <MenuButton
        icon={note}
        background={"#773AC8"}
        onClick={() => onOpenModal("note")}
      />

      <MenuButton
        icon={help}
        background={"#773AC8"}
        onClick={() => onOpenModal("help")}
      />

      <MenuButton
        icon={speaker}
        background={"#773AC8"}
        onClick={() => onOpenModal("speaker")}
      />

      <MenuButton
        icon={close}
        background={"#773AC8"}
        onClick={() => console.log("close clicked")}
      />
    </div >
  );
};

export default TopMenu;