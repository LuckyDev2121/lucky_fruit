import MenuButton from "./MenuButton";

import note from "../assets/TopMenu/ClipboardText.svg";
import music from "../assets/TopMenu/MusicNotes.svg";
import help from "../assets/TopMenu/QuestionMark.svg";
import speaker from "../assets/TopMenu/SpeakerHigh.svg";
import close from "../assets/TopMenu/X.svg";

const TopMenu: React.FC = () => {
  return (
    <div className="flex gap-2">
      <MenuButton
        icon={music}
        background={"#773AC8"}
        onClick={() => console.log("music clicked")}
      />

      <MenuButton
        icon={note}
        background={"#773AC8"}
        onClick={() => console.log("help clicked")}
      />

      <MenuButton
        icon={help}
        background={"#773AC8"}
        onClick={() => console.log("sound clicked")}
      />

      <MenuButton
        icon={speaker}
        background={"#773AC8"}
        onClick={() => console.log("close clicked")}
      />

      <MenuButton
        icon={close}
        background={"#773AC8"}
        onClick={() => console.log("close clicked")}
      />
    </div>
  );
};

export default TopMenu;