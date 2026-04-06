import { motion } from "framer-motion";
import { getAssetUrl, GAME_ASSETS } from "../config/gameConfig";


const points = [
    { top: "125px", left: "90px" },
    { top: "125px", left: "190px" },
    { top: "125px", left: "290px" },
    { top: "225px", left: "290px" },
    { top: "325px", left: "290px" },
    { top: "325px", left: "190px" },
    { top: "325px", left: "90px" },
    { top: "225px", left: "90px" },
    { top: "125px", left: "90px" },
];

export default function MovingImage() {
    return (
        // <div className="absolute w-[280px] h-[280px] top-[90px]  left-1/2 -translate-x-1/2">
        <motion.img
            src={getAssetUrl(GAME_ASSETS.hand)}
            className="w-16 h-16 absolute z-50"
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
        // </div>
    );
}