import React from "react";


type NormalButtonProps = {
    icon: string;
    onClick: () => void;
    size?: number;
};



const NormalButton: React.FC<NormalButtonProps> = ({
    icon,
    onClick,
}) => {
    return (
        <button
            type="button"
            aria-label="menu button"
            onClick={onClick}
            style={{
                position: "relative",
                width: "100 %",
                height: "fit - content",
                border: "none",
                background: "transparent",
                cursor: "pointer",
                padding: 0,
            }}
        >
            {/* Icon */}
            <img
                src={icon}
                alt="menu icon"
                className="relative  object-contain m-auto"
            />
        </button>
    );
};

export default NormalButton;