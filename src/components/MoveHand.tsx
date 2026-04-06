import { motion } from "framer-motion";
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";


const points = [
    { top: "25px", left: "25px" },
    { top: "25px", left: "125px" },
    { top: "25px", left: "225px" },
    { top: "125px", left: "225px" },
    { top: "225px", left: "225px" },
    { top: "225px", left: "125px" },
    { top: "225px", left: "25px" },
    { top: "125px", left: "25px" },
    { top: "25px", left: "25px" },
];

export default function MovingImage() {
    return (
        <div className="absolute w-[280px] h-[280px] top-[90px] z-50 left-1/2 -translate-x-1/2">
            <motion.img
                src={getAssetUrl(GAME_ASSETS.hand)}
                className="w-16 h-16 absolute"
                animate={{
                    top: points.map(p => p.top),
                    left: points.map(p => p.left),
                }}
                transition={{
                    duration: 6,
                    ease: "easeInOut",
                    times: points.map((_, i) => i / (points.length - 1)),
                    repeat: Infinity,
                }}
            />
        </div>
    );
}