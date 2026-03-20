import MenuButton from "./MenuButton";
import note from "../assets/TopMenu/ClipboardText.svg";
import help from "../assets/TopMenu/QuestionMark.svg";
import speaker from "../assets/TopMenu/SpeakerHigh.svg";
import close from "../assets/TopMenu/X.svg";
import cup from "../assets/TopMenu/cup.svg";

type TopMenuProps = {
  onOpenModal: (modal: string) => void;
  onOpenAlert: (alert: string) => void;
};

const TopMenu: React.FC<TopMenuProps> = ({ onOpenModal, onOpenAlert }) => {
  return (
    <div className="flex gap-[5px]">
      <MenuButton
        icon={cup}
        background={"#773AC8"}
        borderColor="none"
        borderWidth="0px"
        onClick={() => onOpenModal("cup")}
      />

      <MenuButton
        borderColor="none"
        borderWidth="0px"
        icon={note}
        background={"#773AC8"}
        onClick={() => onOpenModal("note")}
      />

      <MenuButton
        borderColor="none"
        borderWidth="0px"
        icon={help}
        background={"#773AC8"}
        onClick={() => onOpenModal("help")}
      />

      <MenuButton
        borderColor="none"
        borderWidth="0px"
        icon={speaker}
        background={"#773AC8"}
        onClick={() => onOpenAlert("music")}
      />

      <MenuButton
        borderColor="none"
        borderWidth="0px"
        icon={close}
        background={"#773AC8"}
        onClick={() => console.log("close clicked")}
      />
    </div >
  );
};

export default TopMenu;
