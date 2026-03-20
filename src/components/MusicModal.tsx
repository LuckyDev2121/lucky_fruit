import close from "../assets/TopMenu/X.svg";

type MusicModalProps = {
    isMusicPlaying: boolean;
    isSoundEnabled: boolean;
    onToggleMusic: () => void;
    onToggleSound: () => void;
    onCloseMusicModal: () => void;
};

type ToggleRowProps = {
    label: string;
    isOn: boolean;
    onToggle: () => void;
};
function ToggleRow({ label, isOn, onToggle }: ToggleRowProps) {
    return (
        <div className="flex items-center justify-between">
            <span className="text-[12px] font-bold tracking-[0.02em] text-white">{label} :</span>
            <div className="flex h-[26px] w-[172px] overflow-hidden rounded-full border bg-gradient-to-t from-[#B026C6]  to-[#7812A3] border-[#F467C4] bg-[#E8C8F8] shadow-[inset_0_0_0_1px_rgba(255,255,255,0.14)]">
                <button
                    type="button"
                    onClick={isOn ? undefined : onToggle}
                    className={`h-full flex-1 text-[10px] font-bold leading-none transition ${isOn ? "bg-transparent text-white " : "bg-white text-[#8E42D8] rounded-full"}`}
                >
                    ON
                </button>
                <button
                    type="button"
                    onClick={isOn ? onToggle : undefined}
                    className={`h-full flex-1 text-[10px] font-bold leading-none transition ${isOn ? "bg-white text-[#8E42D8] rounded-full" : "bg-transparent text-white "}`}
                >
                    OFF
                </button>
            </div>
        </div>
    );
}

export default function MusicModal({ isMusicPlaying,
    isSoundEnabled,
    onToggleMusic,
    onToggleSound, onCloseMusicModal }: MusicModalProps) {
    return (
        <div className="relative h-[114px] w-[264px] left-1/2 -translate-x-1/2 rounded-[16px] border border-[#E85BC5] bg-gradient-to-t from-[#9A05E8] via-[#6B27D2] to-[#541EC6] px-5 py-5 shadow-[0_10px_24px_rgba(36,6,79,0.28)]">
            <div className="absolute -right-[12px] -top-[12px] h-[24px] w-[24px] rounded-full text-[14px] font-bold shadow-[0_4px_10px_rgba(54,5,103,0.35)]" style={{ pointerEvents: 'auto' }}>
                <button
                    type="button"
                    aria-label="menu button"
                    onClick={onCloseMusicModal}
                    style={{
                        position: "relative",
                        width: "24px",
                        height: "24px",
                        background: "transparent",
                        cursor: "pointer",
                        padding: 0,
                    }}
                >
                    <div className="absolute inset-0 w-full h-full rounded-full" style={{
                        backgroundColor: "#B026C7",
                        borderColor: "#E85BC5",
                        borderWidth: "1px",
                    }}></div>

                    <img
                        src={close}
                        alt="menu icon"
                        className="relative w-[14px] h-[14px] object-contain m-auto"
                    />
                </button>
            </div>
            <div className="flex h-full flex-col justify-center gap-4">
                <ToggleRow label="Sound" isOn={isSoundEnabled} onToggle={onToggleSound} />
                <ToggleRow label="Music" isOn={isMusicPlaying} onToggle={onToggleMusic} />
            </div>
        </div>
    )
}