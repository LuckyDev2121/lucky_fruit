import React from "react";


type MenuButtonProps = {
    icon: string;
    background: string;
    onClick: () => void;
    size?: number;
    borderColor: string;
    borderWidth: string;
};



const MenuButton: React.FC<MenuButtonProps> = ({
    icon,
    background,
    onClick,
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
                background: "transparent",
                cursor: "pointer",
                padding: 0,
            }}
        >
            {/* Background circle */}
            <div className="absolute inset-0 w-full h-full rounded-full" style={{
                backgroundColor: background,
            }}></div>

            {/* Icon */}
            <img
                src={icon}
                alt="menu icon"
                className="relative w-[15px] h-[15px] object-contain m-auto"
            />
        </button>
    );
};

export default MenuButton;