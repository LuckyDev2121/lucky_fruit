import MenuButton from "./MenuButton";

type TopMenuProps = {
  onOpenModal: (modal: string) => void;
  onOpenAlert: (alert: string) => void;
};

function CupIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M4.1 3.2H10.1V4.5C10.1 6.7 8.95 8.45 7.1 8.45C5.25 8.45 4.1 6.7 4.1 4.5V3.2Z"
        fill="white"
      />
      <path
        d="M10.1 3.8H11.45C12.35 3.8 13.1 4.55 13.1 5.45C13.1 6.75 11.95 7.8 10.55 7.8H9.95"
        stroke="white"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M4.1 3.8H2.75C1.85 3.8 1.1 4.55 1.1 5.45C1.1 6.75 2.25 7.8 3.65 7.8H4.25"
        stroke="white"
        strokeWidth="1.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M7.1 8.45V10.35"
        stroke="white"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M4.95 11.95H9.25"
        stroke="white"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function ClipboardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <rect x="3" y="2.6" width="9" height="10.4" rx="1.8" stroke="white" strokeWidth="1.1" />
      <rect x="5" y="1.4" width="5" height="2.6" rx="1" fill="white" />
      <path d="M5.2 6.1H9.8" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M5.2 8.1H9.8" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
      <path d="M5.2 10.1H8.6" stroke="white" strokeWidth="1.1" strokeLinecap="round" />
    </svg>
  );
}

function SpeakerHighIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M2.2 8.8H4.4L7.45 11V4L4.4 6.2H2.2V8.8Z"
        fill="white"
        stroke="white"
        strokeWidth="0.5"
        strokeLinejoin="round"
      />
      <path
        d="M9.25 6C9.8 6.45 10.1 7.1 10.1 7.75C10.1 8.4 9.8 9.05 9.25 9.5"
        stroke="white"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
      <path
        d="M10.8 4.75C11.7 5.5 12.2 6.6 12.2 7.75C12.2 8.9 11.7 10 10.8 10.75"
        stroke="white"
        strokeWidth="1.1"
        strokeLinecap="round"
      />
    </svg>
  );
}

function QuestionMarkIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M5.55 5.4C5.55 4.35 6.4 3.5 7.45 3.5C8.5 3.5 9.35 4.25 9.35 5.2C9.35 5.95 8.95 6.45 8.25 6.9C7.6 7.3 7.2 7.7 7.2 8.45V8.7"
        stroke="white"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="7.2" cy="11.1" r="0.8" fill="white" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" aria-hidden="true">
      <path
        d="M4.2 4.2L10.8 10.8"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
      <path
        d="M10.8 4.2L4.2 10.8"
        stroke="white"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

const TopMenu: React.FC<TopMenuProps> = ({ onOpenModal, onOpenAlert }) => {
  return (
    <div className="flex gap-[5px]">
      <MenuButton
        icon={<CupIcon />}
        background={"#773AC8"}
        borderColor="none"
        borderWidth="0px"
        onClick={() => onOpenModal("cup")}
      />

      <MenuButton
        borderColor="none"
        borderWidth="0px"
        icon={<ClipboardIcon />}
        background={"#773AC8"}
        onClick={() => onOpenModal("note")}
      />

      <MenuButton
        borderColor="none"
        borderWidth="0px"
        icon={<QuestionMarkIcon />}
        background={"#773AC8"}
        onClick={() => onOpenModal("help")}
      />

      <MenuButton
        borderColor="none"
        borderWidth="0px"
        icon={<SpeakerHighIcon />}
        background={"#773AC8"}
        onClick={() => onOpenAlert("music")}
      />

      <MenuButton
        borderColor="none"
        borderWidth="0px"
        icon={<CloseIcon />}
        background={"#773AC8"}
        onClick={() => console.log("close clicked")}
      />
    </div >
  );
};

export default TopMenu;
