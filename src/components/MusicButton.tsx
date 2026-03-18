import React from "react";


type MusicButtonProps = {
    icon: string;
    background: string;
    onClick: () => void;
    isMuted: boolean;
    size?: number;
};



const MusicButton: React.FC<MusicButtonProps> = ({
    icon,
    background,
    onClick,
    isMuted,
    size = 32,
}) => {
    return (
        <button
            type="button"
            aria-label="menu button"
            onClick={onClick}
            style={{
                position: "relative",
                width: size,
                height: size,
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
                opacity: isMuted ? 0.5 : 1,
            }}
        >
            {/* Background circle */}
            <div className="absolute inset-0 w-full h-full rounded-full" style={{ backgroundColor: background }}></div>

            {/* Icon */}
            <img
                src={icon}
                alt="menu icon"
                className="relative w-[15px] h-[15px] object-contain m-auto"
            />
        </button>
    );
};

export default MusicButton;
